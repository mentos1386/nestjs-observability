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
  private getTracer() {
    return trace.getTracer(INSTRUMENTATION_NAME);
  }

  private getSpan(): Span | undefined {
    return trace.getSpan(context.active());
  }

  inject<T>(fun: () => Promise<T>): Promise<T> {
    // TODO(mentos1386): Add support for context propagation.
    // TODO(mentos1386): This is only needed in case of "custom" implementations,
    // such as queue processors.
    //
    // Maybe we shouldn't do opentelemetry injection at all. Maybe only in case of no span being started,
    // but treat that as a not-intended, and redirect users twoards tarting spans manually.
    //
    // Let this library unite the "setAttributes" and "capture*" methods only.
    return this.getTracer().startActiveSpan('inject', (span) =>
      fun().finally(() => span.end())
    );
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
