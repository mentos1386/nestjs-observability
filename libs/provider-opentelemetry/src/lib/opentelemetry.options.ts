import { ConfigurableModuleBuilder } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProviderOpentelemetryModuleOptions {}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ProviderOpentelemetryModuleOptions>()
    .setClassMethodName('forRoot')
    .build();
