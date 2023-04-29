import { Global, Inject, MiddlewareConsumer, Module } from '@nestjs/common';
import { ProviderPinoMiddleware } from './pino.middleware';
import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  ProviderPinoModuleOptions,
} from './pino.options';
import { ProviderPino } from './pino.provider';

@Global()
@Module({
  providers: [ProviderPino, ProviderPinoMiddleware],
  exports: [ProviderPino, ProviderPinoMiddleware],
})
export class ProviderPinoModule extends ConfigurableModuleClass {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly pinoOptions: ProviderPinoModuleOptions
  ) {
    super();
  }

  configure(consumer: MiddlewareConsumer) {
    const middleware = this.pinoOptions.middleware ?? true;
    if (middleware === true) {
      consumer.apply(ProviderPinoMiddleware).forRoutes('*');
    }
  }
}
