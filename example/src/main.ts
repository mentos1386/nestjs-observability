import './instrumentation';
import { NestFactory } from '@nestjs/core';

import { ObservabilityLogger } from '@nestjs-observability/core';
import { AppModule } from './app/app.module';

import * as Sentry from '@sentry/node';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(ObservabilityLogger);
  app.useLogger(logger);

  const express = app.getHttpAdapter().getInstance();

  Sentry.init({
    dsn: 'https://12e6ca9b70354161bc2a6c0478e01f9f@o4505092058775552.ingest.sentry.io/4505092059889664',
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Sentry.Integrations.Express({ app: express }),
      // Automatically instrument Node.js libraries and frameworks
      ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
    ],
    tracesSampleRate: 1.0,
  });
  express.use(Sentry.Handlers.requestHandler());
  express.use(Sentry.Handlers.tracingHandler());
  express.use(Sentry.Handlers.errorHandler());

  const globalPrefix = 'api';
  //app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
