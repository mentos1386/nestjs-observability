import { ObservabilityService } from '@nestjs-observability/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly ObservabilityService: ObservabilityService) {}

  getData(): { message: string } {
    this.ObservabilityService.setAttributes({ some: 'attribute' });
    this.ObservabilityService.warning('Whups?');
    return { message: 'Hello API' };
  }
}