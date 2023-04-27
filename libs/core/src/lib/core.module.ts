import {
  Global,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  ObservabilityModuleOptions,
} from './core.options';
import { ObservabilityLogger } from './logger.service';
import { ObservabilityMiddleware } from './observability.middleware';
import { ObservabilityService } from './observability.service';
import { ObservabilityProviderService } from './provider.service';

@Global()
@Module({
  providers: [
    ObservabilityMiddleware,
    ObservabilityLogger,
    ObservabilityService,
    ObservabilityProviderService,
  ],
  exports: [ObservabilityLogger, ObservabilityService, ObservabilityMiddleware],
})
export class ObservabilityModule
  extends ConfigurableModuleClass
  implements NestModule
{
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly observabilityOptions: ObservabilityModuleOptions
  ) {
    super();
  }

  configure(consumer: MiddlewareConsumer) {
    if (this.observabilityOptions.middleware === true) {
      consumer.apply(ObservabilityMiddleware).forRoutes('*');
    }
  }
}
