import { Attributes, Provider } from '@nestjs-observability/spec';
import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  MODULE_OPTIONS_TOKEN,
  ObservabilityModuleOptions,
} from './core.options';

@Injectable()
export class ObservabilityProviderService implements Provider {
  private providers: Provider[] = [];

  constructor(
    private readonly moduleRef: ModuleRef,
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: ObservabilityModuleOptions
  ) {}

  onModuleInit() {
    // Try to get the provider instances.
    this.providers = this.options.providers.map((provider) =>
      this.moduleRef.get(provider, { strict: false })
    );
  }

  setAttributes(context: string, attributes: Attributes): void {
    return this.providers.forEach((provider) =>
      provider.setAttributes(context, attributes)
    );
  }

  captureInfo(
    context: string,
    message: string,
    data: unknown = {},
    attributes: Attributes = {}
  ): void {
    return this.providers.forEach((provider) =>
      provider.captureInfo(context, message, data, attributes)
    );
  }

  captureDebug(
    context: string,
    message: string,
    data: unknown = {},
    attributes: Attributes = {}
  ): void {
    return this.providers.forEach((provider) =>
      provider.captureDebug(context, message, data, attributes)
    );
  }

  captureWarning(
    context: string,
    messageOrError: string | Error,
    data: unknown = {},
    attributes: Attributes = {}
  ): void {
    return this.providers.forEach((provider) =>
      provider.captureWarning(context, messageOrError, data, attributes)
    );
  }

  captureError(
    context: string,
    messageOrError: string | Error,
    data: unknown = {},
    attributes: Attributes = {}
  ): void {
    return this.providers.forEach((provider) =>
      provider.captureError(context, messageOrError, data, attributes)
    );
  }
}
