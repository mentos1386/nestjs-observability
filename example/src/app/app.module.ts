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

@Module({
  imports: [
    ProviderPinoModule.forRoot({
      pinoOptions: {
        base: undefined,
        formatters: { level: (label) => ({ level: label }) },
        transport: { target: 'pino-pretty' },
      },
    }),
    ObservabilityModule.forRoot({
      level: ObservabilityLevel.DEBUG,
      providers: [ProviderPino],
      middleware: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
