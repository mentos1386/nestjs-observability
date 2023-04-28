import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Logger } from 'pino';
import { Attributes, Provider } from '@nestjs-observability/spec';
import { AsyncLocalStorage } from 'async_hooks';
import {
  MODULE_OPTIONS_TOKEN,
  ProviderPinoModuleOptions,
} from './pino.options';

@Injectable()
export class ProviderPino implements Provider, OnApplicationShutdown {
  private readonly logger: Logger;

  private readonly storage = new AsyncLocalStorage<{
    attributesForContext: Record<string, Attributes>;
  }>();

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: ProviderPinoModuleOptions
  ) {
    this.logger = options.pino;
  }

  private getContextWithAttributesAndData(
    context: string,
    data?: unknown,
    attributes?: Attributes
  ): Record<string, unknown> {
    const store = this.storage.getStore() ?? { attributesForContext: {} };

    const ctx: Record<string, unknown> = {
      context,
      ...store.attributesForContext,
    };

    if (context in store || attributes) {
      ctx[context] = { ...store.attributesForContext[context], ...attributes };
    }

    if (data) {
      ctx.extra = data;
    }

    return ctx;
  }

  onApplicationShutdown() {
    this.logger.flush();
  }

  inject<T>(fun: () => Promise<T>): Promise<T> {
    return this.storage.run({ attributesForContext: {} }, () => fun());
  }

  setAttributes(context: string, attributes: Attributes): void {
    const store = this.storage.getStore();
    if (!store) {
      this.logger.warn(
        `Unable to assign logger attributes as we are not in scope.\n` +
          `This can be fixed by wrapping execution in: ObservabilityService.initiateScope().`
      );
      return;
    }

    store.attributesForContext = {
      ...store.attributesForContext,
      [context]: { ...store.attributesForContext[context], ...attributes },
    };
  }

  captureInfo(
    context: string,
    message: string,
    data?: unknown,
    attributes?: Attributes
  ): void {
    const ctx = this.getContextWithAttributesAndData(context, data, attributes);
    this.logger.info(ctx, message);
  }

  captureDebug(
    context: string,
    message: string,
    data?: unknown,
    attributes?: Attributes
  ): void {
    const ctx = this.getContextWithAttributesAndData(context, data, attributes);
    this.logger.debug(ctx, message);
  }

  captureWarning(
    context: string,
    messageOrError: string | Error,
    data?: unknown,
    attributes?: Attributes
  ): void {
    const ctx = this.getContextWithAttributesAndData(context, data, attributes);

    if (messageOrError instanceof Error) {
      ctx.err = messageOrError;
      this.logger.warn(ctx);
    } else {
      this.logger.warn(ctx, messageOrError);
    }
  }

  captureError(
    context: string,
    messageOrError: string | Error,
    data?: unknown,
    attributes?: Attributes
  ): void {
    const ctx = this.getContextWithAttributesAndData(context, data, attributes);

    if (messageOrError instanceof Error) {
      ctx.err = messageOrError;
      this.logger.error(ctx);
    } else {
      this.logger.error(ctx, messageOrError);
    }
  }
}
