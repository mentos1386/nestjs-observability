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
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: 'https://12e6ca9b70354161bc2a6c0478e01f9f@o4505092058775552.ingest.sentry.io/4505092059889664',
  tracesSampleRate: 1.0,
});

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
    ObservabilityModule.forRoot({
      level: ObservabilityLevel.DEBUG,
      providers: [ProviderPino, ProviderSentry],
      middleware: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
