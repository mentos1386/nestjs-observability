import { ConfigurableModuleBuilder } from '@nestjs/common';
import { Logger } from 'pino';

export interface ProviderPinoModuleOptions {
  pino: Logger;
  middleware?: boolean;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ProviderPinoModuleOptions>()
    .setClassMethodName('forRoot')
    .build();
