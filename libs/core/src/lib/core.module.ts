import { Global, Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './core.options';
import { ObservabilityLogger } from './logger.service';
import { ObservabilityService } from './observability.service';
import { ObservabilityProviderService } from './provider.service';

@Global()
@Module({
  providers: [
    ObservabilityLogger,
    ObservabilityService,
    ObservabilityProviderService,
  ],
  exports: [ObservabilityLogger, ObservabilityService],
})
export class ObservabilityModule extends ConfigurableModuleClass {}
