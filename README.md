<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="http://kamilmysliwiec.com/public/nest-logo.png#1" alt="Nest Logo" />   </a>
</p>

<h1 align="center">Observability solution for NestJS</h1>

<p align="center">
<a href="https://app.codacy.com/gh/mentos1386/nestjs-observability/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade"><img src="https://app.codacy.com/project/badge/Grade/8829117cffa74d5f86ad0bfae5937706"/></a>
</p>


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
