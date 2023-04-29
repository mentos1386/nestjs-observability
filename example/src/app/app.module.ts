import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import {
  ObservabilityLevel,
  ObservabilityModule,
} from '@nestjs-observability/core';

import {
  ProviderPino,
  ProviderPinoModule,
} from '@nestjs-observability/provider-pino';
import pino from 'pino';

import {
  ProviderSentry,
  ProviderSentryModule,
} from '@nestjs-observability/provider-sentry';

import {
  ProviderOpentelemetry,
  ProviderOpentelemetryModule,
} from '@nestjs-observability/provider-opentelemetry';

@Module({
  imports: [
    ProviderPinoModule.forRoot({
      pino: pino({
        base: undefined,
        formatters: { level: (label) => ({ level: label }) },
        transport: { target: 'pino-pretty' },
      }),
    }),
    ProviderSentryModule.forRoot({}),
    ProviderOpentelemetryModule.forRoot({}),
    ObservabilityModule.forRoot({
      level: ObservabilityLevel.DEBUG,
      providers: [ProviderPino, ProviderSentry, ProviderOpentelemetry],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
