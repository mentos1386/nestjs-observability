import { Attributes } from './attributes';

/*
 * Provider is the interface that should be implemented by the
 * observability providers.
 *
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
   * Helper function to set OpenTelemetry ENDUSER_ID attribute.
   * It should behave exactly the same as calling `setAttributes({ 'enduser.id': userId })`
   */
  setUser(user: { userId: string }): void;

  /*
   * Should set attributes to the current injection.
   */
  setAttributes(attributes: Attributes): void;

  /*
   * Capture a Info level message.
   */
  captureInfo(context: string, message: string, attributes?: Attributes): void;
  captureInfo(
    context: string,
    something: unknown,
    attributes?: Attributes
  ): void;
  captureInfo(
    context: string,
    message: string,
    something: unknown,
    attributes?: Attributes
  ): void;

  /*
   * Capture a Debug level message.
   */
  captureDebug(context: string, message: string, attributes?: Attributes): void;
  captureDebug(
    context: string,
    something: unknown,
    attributes?: Attributes
  ): void;
  captureDebug(
    context: string,
    message: string,
    something: unknown,
    attributes?: Attributes
  ): void;

  /*
   * Capture a Warning level message.
   */
  captureWarning(context: string, error: Error, attributes?: Attributes): void;
  captureWarning(
    context: string,
    message: string,
    attributes?: Attributes
  ): void;
  captureWarning(
    context: string,
    something: unknown,
    attributes?: Attributes
  ): void;

  /*
   * Capture a Error level message.
   */
  captureError(context: string, error: Error, attributes?: Attributes): void;
  captureError(context: string, message: string, attributes?: Attributes): void;
  captureError(
    context: string,
    something: unknown,
    attributes?: Attributes
  ): void;
}
