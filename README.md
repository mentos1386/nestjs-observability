<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="http://kamilmysliwiec.com/public/nest-logo.png#1" alt="Nest Logo" />   </a>
</p>

<h1 align="center">Observability solution for NestJS</h1>

<p align="center">
<a href="https://app.codacy.com/gh/mentos1386/nestjs-observability/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade"><img src="https://app.codacy.com/project/badge/Grade/8829117cffa74d5f86ad0bfae5937706"/></a>
</p>


> **Warning**
> This project is still in the making and not yet published to NPM.

### Description

This is a collection of modules for [Nest](https://github.com/nestjs/nest) which bring you opinionated observability solution.

It's a combination of an `@nestjs-observability/core` module which brings the core functionality that is suposed to be used by
libraries and applications.

And a set of _providers_ such as `@nestjs-observability/provider-opentelemetry`, `@nestjs-observability/provider-sentry`,
`@nestjs-observability/provider-pino` and more. The addons are following a `@nestjs-observability/spec` which means that any new provider
can be easily added and plugied in to the whole observability pipeline.

This solution will make your code agnostic to any specific provider and make it easy for you to switch and use multiple providers at once.

#### The caviat

Due to this being an abstraction over multiple providers, there is a loss of _deep_ integration to any of the specific providers. This is
suposed to be the 80% solution and for the more specific (niche) use cases you can always use the provider's SDK directly.

`nestjs-observability` should make it easiy to get observability solution in place, but not block you when trying to do more.


## Example

```
npm i @nestjs-observabilty/core @nestjs-observabilty/provider-pino pino pino-pretty
```

> main.ts
```ts
import { NestFactory } from '@nestjs/core';

import { ObservabilityLogger } from '@nestjs-observability/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  // Make sure to buffer logs.
  // To not use the Nest Default logger before we use the ObservabilityLogger.
  // You can read more about this https://docs.nestjs.com/techniques/logger#dependency-injection
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Get ObservabilityLogger instance.
  const logger = app.get(ObservabilityLogger);
  // Use it as Nest default logger.
  app.useLogger(logger);

  await app.listen(3000);

  logger.log(
    `🚀 Application is running on: http://localhost:3000`
  );
}

bootstrap();
```

> app.module.ts
```ts
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
    // Example configuration for ProviderPino.
    ProviderPinoModule.forRoot({
      pinoOptions: {
        base: undefined,
        formatters: { level: (label) => ({ level: label }) },
        transport: { target: 'pino-pretty' },
      },
    }),
    // Configure ObservabilityModule with our ProviderPino
    ObservabilityModule.forRoot({
      level: ObservabilityLevel.DEBUG,
      providers: [ProviderPino],
      // Enables ObservabilityMiddleware to be used.
      // This _injects_ observability context to all http requests.
      middleware: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}```


> app.service.ts
```ts
import { ObservabilityService } from '@nestjs-observability/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // Import ObservabilityService
  constructor(private readonly ObservabilityService: ObservabilityService) {}

  getData(userId: string): { message: string } {
    // Set some attributes, contextual informaton.
    this.ObservabilityService.setAttributes({ 'user.id': userId });

    // Use different levels to observe actions.
    this.ObservabilityService.debug('Called getData!');

    // Capture errors,
    // the rrorId can be used to send as response, to
    // give be able to corelate the errors on cleint side with logs/traces etc.
    const { errorId } = this.observabilityService.error(new Error("Huh?"));

    return { message: 'Hello API' };
  }
}
```

## Architecure


#### Log Levels

There are four possible log levels:

* `info` which is the least verbose.
* `debug` which is the most verbose.
* `warn` for warnings, something that is important but not something that would trigger an notification event.
* `error` for errors, something that is important enough to trigger an notification event, something that should be looked in to and fixed.

#### Providers

Providers are glue between the `nestjs-observabilty` and other services. This services can be loggers like `@nestjs-observabilty/provider-pino`
Sass services like for `@nestjs-observabilty/provider-sentry`.
