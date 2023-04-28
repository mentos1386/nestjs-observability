import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './opentelemetry.options';
import { ProviderOpentelemetry } from './opentelemetry.provider';

@Module({
  providers: [ProviderOpentelemetry],
  exports: [ProviderOpentelemetry],
})
export class ProviderOpentelemetryModule extends ConfigurableModuleClass {}
