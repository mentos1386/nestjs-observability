export type Attributes = Record<string, string>;

// Refer to OpenTelemetry Semantic Convention for more
// good names for attributes.
// https://github.com/open-telemetry/opentelemetry-js/tree/main/packages/opentelemetry-semantic-conventions
//
// All the attributes defined here should start with `no` to denote "nestjs-observability" namespace.
export enum CommonAttributes {
  ERROR_ID = 'no.error.id',
  ERROR_MESSAGE = 'no.error.message',
  ERROR_NAME = 'no.error.name',

  CONTEXT = 'no.context',
}
