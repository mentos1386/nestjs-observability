export type Attributes = Record<string, string>;

export const Namespace = 'nestjs';

// Refer to OpenTelemetry Semantic Convention for more
// good names for attributes.
// https://github.com/open-telemetry/opentelemetry-js/tree/main/packages/opentelemetry-semantic-conventions
export enum CommonAttributes {
  ERROR_ID = 'nestjs.error.id',
  ERROR_MESSAGE = 'nestjs.error.message',
  ERROR_NAME = 'nestjs.error.name',

  CONTEXT = 'nestjs.context',
}
