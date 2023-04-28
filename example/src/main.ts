import './instrumentation';
import { NestFactory } from '@nestjs/core';

import { ObservabilityLogger } from '@nestjs-observability/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(ObservabilityLogger);
  app.useLogger(logger);

  const globalPrefix = 'api';
  //app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
