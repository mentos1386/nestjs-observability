import { Provider } from '@nestjs-observability/spec';
import { ConfigurableModuleBuilder } from '@nestjs/common';
import { Class } from 'type-fest';

export enum ObservabilityLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export const ObservabilityLevelValue = {
  [ObservabilityLevel.DEBUG]: 10,
  [ObservabilityLevel.INFO]: 20,
  [ObservabilityLevel.WARN]: 30,
  [ObservabilityLevel.ERROR]: 40,
};

export interface ObservabilityModuleOptions {
  level: ObservabilityLevel;
  providers: Class<Provider>[];
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ObservabilityModuleOptions>()
    .setClassMethodName('forRoot')
    .build();
