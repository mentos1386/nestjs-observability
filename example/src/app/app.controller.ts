import { ObservabilityService } from '@nestjs-observability/core';
import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly ObservabilityService: ObservabilityService
  ) {}

  @Get()
  getData() {
    this.ObservabilityService.info('Hello World!', undefined, { a: 'x' });
    this.ObservabilityService.setAttributes({ foo: 'bar ' });
    return this.appService.getData();
  }
}
