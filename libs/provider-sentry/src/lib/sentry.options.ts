import { ConfigurableModuleBuilder } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProviderSentryModuleOptions {}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ProviderSentryModuleOptions>()
    .setClassMethodName('forRoot')
    .build();
