import { ObservabilityService } from '@nestjs-observability/core';
import { Span as OpenTelemetrySpan } from '@nestjs-observability/provider-opentelemetry';
import { Span as SentrySpan } from '@nestjs-observability/provider-sentry';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly ObservabilityService: ObservabilityService) {}

  @OpenTelemetrySpan()
  @SentrySpan()
  getData(): { message: string } {
    this.ObservabilityService.setAttributes({ some: 'attribute' });
    this.ObservabilityService.error(new Error('Whups?'));
    return { message: 'Hello API' };
  }
}
