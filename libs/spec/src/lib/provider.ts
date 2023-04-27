import { Attributes } from './attributes';

/*
 * Provider is the interface that should be implemented by the
 * observability providers.
 */
export interface Provider {
  /**
   * Injects the Adapter in to the lifecycle of the function being passed.
   *
   * FIXME: Sometimes there can be more info provided to the function. Like opentelemetry context for
   *         context propagation. How should that ba handled?
   */
  inject<T>(fun: () => Promise<T>): Promise<T>;

  /*
   * Should set attributes to the current injection.
   */
  setAttributes(context: string, attributes: Attributes): void;

  /*
   * Capture a Info level message.
   */
  captureInfo(
    context: string,
    message: string,
    data?: unknown,
    attributes?: Attributes
  ): void;

  /*
   * Capture a Debug level message.
   */
  captureDebug(
    context: string,
    message: string,
    data?: unknown,
    attributes?: Attributes
  ): void;

  /*
   * Capture a Warning level message.
   */
  captureWarning(
    context: string,
    messageOrError: string | Error,
    data?: unknown,
    attributes?: Attributes
  ): void;

  /*
   * Capture a Error level message.
   */
  captureError(
    context: string,
    messageOrError: string | Error,
    data?: unknown,
    attributes?: Attributes
  ): void;
}
