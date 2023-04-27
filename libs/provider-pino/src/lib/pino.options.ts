import { ConfigurableModuleBuilder } from '@nestjs/common';
import { LoggerOptions, DestinationStream } from 'pino';

export interface ProviderPinoModuleOptions {
  // It make no sense to provide level, as that is already handled by the ObservabilityModule.
  pinoOptions: Omit<LoggerOptions, 'level'> | DestinationStream;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ProviderPinoModuleOptions>()
    .setClassMethodName('forRoot')
    .build();
