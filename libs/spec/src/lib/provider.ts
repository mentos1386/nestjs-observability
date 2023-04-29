import { Attributes } from './attributes';

/*
 * Provider is the interface that should be implemented by the
 * observability providers.
 */
export interface Provider {
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
