import { Global, Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './pino.options';
import { ProviderPino } from './pino.provider';

@Global()
@Module({
  providers: [ProviderPino],
  exports: [ProviderPino],
})
export class ProviderPinoModule extends ConfigurableModuleClass {}
