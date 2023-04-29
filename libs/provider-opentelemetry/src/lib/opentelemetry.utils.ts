export const copyMetadataFromFunctionToFunction = (
  // eslint-disable-next-line @typescript-eslint/ban-types
  originalFunction: Function,
  // eslint-disable-next-line @typescript-eslint/ban-types
  newFunction: Function,
): void => {
  // Get the current metadata and set onto the wrapper
  // to ensure other decorators ( ie: NestJS EventPattern / RolesGuard )
  // won't be affected by the use of this instrumentation
  Reflect.getMetadataKeys(originalFunction).forEach(metadataKey => {
    Reflect.defineMetadata(
      metadataKey,
      Reflect.getMetadata(metadataKey, originalFunction),
      newFunction,
    );
  });
};
