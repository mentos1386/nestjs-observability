import { copyMetadataFromFunctionToFunction } from '../sentry.utils';

import * as Sentry from '@sentry/node';

export function Span(op?: string, description?: string) {
  return (
    target: unknown,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor
  ) => {
    const originalFunction = propertyDescriptor.value;
    const wrappedFunction = function PropertyDescriptor(
      this: unknown,
      ...args: unknown[]
    ) {
      const spanOp = op ?? `${target.constructor.name}.${propertyKey}`;

      const transaction = Sentry.getActiveTransaction();

      const span = transaction?.startChild({
        op: spanOp,
        description,
      });

      if (originalFunction.constructor.name === 'AsyncFunction') {
        return originalFunction
          .apply(this, args)
          .then((result: any) => {
            span?.setStatus('ok');
            return result;
          })
          .catch((error: Error) => {
            span?.setStatus('unknown_error');
            throw error;
          })
          .finally(() => {
            span?.finish;
          });
      }

      try {
        const result = originalFunction.apply(this, args);
        span?.setStatus('ok');
        return result;
      } catch (error) {
        span?.setStatus('unknown_error');
        // Throw error to propagate it further
        throw error;
      } finally {
        span?.finish();
      }
    };
    // eslint-disable-next-line no-param-reassign
    propertyDescriptor.value = wrappedFunction;

    copyMetadataFromFunctionToFunction(originalFunction, wrappedFunction);
  };
}
