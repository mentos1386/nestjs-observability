<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="http://kamilmysliwiec.com/public/nest-logo.png#1" alt="Nest Logo" />   </a>
</p>

<h1 align="center">Observability solution for NestJS</h1>

### Description

This is a collection of modules for [Nest](https://github.com/nestjs/nest) which bring you opinionated observability solution.

It's a combination of an `@nestjs-observability/core` module which brings the core functionality that is suposed to be used by
libraries and applications.

And a set of _providers_ such as `@nestjs-observability/opentelemetry`, `@nestjs-observability/sentry`,
`@nestjs-observability/pino` and more. The addons are following a `@nestjs-observability/spec` which means that any new provider
can be easily added and plugied in to the whole observability pipeline.

This solution will make your code agnostic to any specific provider and make it easy for you to switch and use multiple providers at once.

#### The caviat

Due to this being an abstraction over multiple providers, there is a loss of _deep_ integration to any of the specific providers. This is
suposed to be the 80% solution and for the more specific (niche) use cases you can always use the provider's SDK directly.

`nestjs-observability` should make it easiy to get observability solution in place, but not block you when trying to do more.
