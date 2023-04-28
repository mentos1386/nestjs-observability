import { Injectable } from '@nestjs/common';
import {
  Attributes,
  CommonAttributes,
  Provider,
} from '@nestjs-observability/spec';

import { Scope, Hub } from '@sentry/node';
import * as Sentry from '@sentry/node';

@Injectable()
export class ProviderSentry implements Provider {
  private getScopeOrHub(): Scope | Hub {
    // Get current hub.
    const hub = Sentry.getCurrentHub();

    // Then we try to get scope from hub.
    const scope = hub.getScope();
    if (scope) {
      return scope;
    }

    // Otherwise just return hub.
    return hub;
  }

  inject<T>(fun: () => Promise<T>): Promise<T> {
    return Sentry.runWithAsyncContext(() => {
      Sentry.getCurrentHub().getScope()?.clear();
      return fun();
    });
  }

  setAttributes(_context: string, attributes: Attributes): void {
    this.getScopeOrHub().setTags(attributes);
  }

  captureInfo(
    context: string,
    message: string,
    data?: unknown,
    attributes?: Attributes
  ): void {
    this.getScopeOrHub().addBreadcrumb({
      message,
      data: { [CommonAttributes.CONTEXT]: context, ...attributes, data },
      category: 'log',
      type: 'info',
      level: 'info',
    });
  }

  captureDebug(
    context: string,
    message: string,
    data?: unknown,
    attributes?: Attributes
  ): void {
    this.getScopeOrHub().addBreadcrumb({
      message,
      data: { [CommonAttributes.CONTEXT]: context, ...attributes, data },
      category: 'log',
      type: 'debug',
      level: 'debug',
    });
  }

  captureWarning(
    context: string,
    messageOrError: string | Error,
    data?: unknown,
    attributes?: Attributes
  ): void {
    this.getScopeOrHub().addBreadcrumb({
      message:
        messageOrError instanceof Error
          ? messageOrError.message
          : messageOrError,
      data: { [CommonAttributes.CONTEXT]: context, ...attributes, data },
      category: messageOrError instanceof Error ? 'error' : 'log',
      type: 'debug',
      level: 'debug',
    });
  }

  captureError(
    context: string,
    messageOrError: string | Error,
    data?: unknown,
    attributes?: Attributes
  ): void {
    this.getScopeOrHub().setContext(context, data);
    this.getScopeOrHub().setTags(attributes);
    Sentry.captureException(messageOrError);
  }
}
