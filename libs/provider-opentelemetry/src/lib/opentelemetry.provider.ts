import { Injectable } from '@nestjs/common';
import {
  Attributes,
  CommonAttributes,
  Provider,
} from '@nestjs-observability/spec';

import { trace, context, Span, SpanStatusCode } from '@opentelemetry/api';

export const INSTRUMENTATION_NAME =
  '@nestjs-observability/provider-opentelemetry';

@Injectable()
export class ProviderOpentelemetry implements Provider {
  private getSpan(): Span | undefined {
    return trace.getSpan(context.active());
  }

  setAttributes(_context: string, attributes: Attributes): void {
    this.getSpan()?.setAttributes(attributes);
  }

  captureInfo(
    context: string,
    message: string,
    _data?: unknown,
    attributes?: Attributes
  ): void {
    this.getSpan()?.addEvent(message, {
      [CommonAttributes.CONTEXT]: context,
      ...attributes,
    });
  }

  captureDebug(
    context: string,
    message: string,
    _data?: unknown,
    attributes?: Attributes
  ): void {
    this.getSpan()?.addEvent(message, {
      [CommonAttributes.CONTEXT]: context,
      ...attributes,
    });
  }

  captureWarning(
    context: string,
    messageOrError: string | Error,
    _data?: unknown,
    attributes?: Attributes
  ): void {
    this.getSpan()?.setAttributes({
      [CommonAttributes.CONTEXT]: context,
      ...attributes,
    });
    this.getSpan()?.recordException(messageOrError);
    this.getSpan()?.setStatus({
      code: SpanStatusCode.ERROR,
      message:
        messageOrError instanceof Error
          ? messageOrError.message
          : messageOrError,
    });
  }

  captureError(
    context: string,
    messageOrError: string | Error,
    _data?: unknown,
    attributes?: Attributes
  ): void {
    this.getSpan()?.setAttributes({
      [CommonAttributes.CONTEXT]: context,
      ...attributes,
    });
    this.getSpan()?.recordException(messageOrError);
    this.getSpan()?.setStatus({
      code: SpanStatusCode.ERROR,
      message:
        messageOrError instanceof Error
          ? messageOrError.message
          : messageOrError,
    });
  }
}
