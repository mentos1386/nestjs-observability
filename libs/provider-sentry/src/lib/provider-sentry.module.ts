import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './sentry.options';
import { ProviderSentry } from './sentry.provider';

@Module({
  providers: [ProviderSentry],
  exports: [ProviderSentry],
})
export class ProviderSentryModule extends ConfigurableModuleClass {}
