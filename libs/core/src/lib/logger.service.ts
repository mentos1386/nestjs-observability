import { Injectable, LoggerService } from '@nestjs/common';
import { inspect } from 'util';
import { ObservabilityLevel } from './core.options';
import { ObservabilityProviderService } from './provider.service';

@Injectable()
export class ObservabilityLogger implements LoggerService {
  constructor(private readonly providerService: ObservabilityProviderService) {}

  private unknownToString(message: unknown): string {
    if (typeof message === 'string') return message;
    return inspect(message);
  }

  verbose(message: unknown, ...optionalParams: unknown[]) {
    this.debug(message, ...optionalParams);
  }

  debug(message: unknown, ...optionalParams: unknown[]) {
    const { context, messageOrError, data } =
      this.transformToContextMessageData(
        ObservabilityLevel.DEBUG,
        message,
        ...optionalParams
      );

    this.providerService.captureDebug(context, messageOrError.toString(), data);
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    const { context, messageOrError, data } =
      this.transformToContextMessageData(
        ObservabilityLevel.INFO,
        message,
        ...optionalParams
      );

    this.providerService.captureInfo(context, messageOrError.toString(), data);
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    const { context, messageOrError, data } =
      this.transformToContextMessageData(
        ObservabilityLevel.WARN,
        message,
        ...optionalParams
      );

    this.providerService.captureWarning(context, messageOrError, data);
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    const { context, messageOrError, data } =
      this.transformToContextMessageData(
        ObservabilityLevel.ERROR,
        message,
        ...optionalParams
      );

    this.providerService.captureError(context, messageOrError, data);
  }

  private transformToContextMessageData(
    level: ObservabilityLevel,
    message: unknown,
    ...optionalParams: unknown[]
  ): { context: string; messageOrError: string | Error; data?: unknown } {
    let context = 'UnknownContext';

    // optionalParams contains extra params passed to logger
    // context name is the last item
    let params: unknown[] = [];
    if (optionalParams.length !== 0) {
      context = String(optionalParams[optionalParams.length - 1]);
      params = optionalParams.slice(0, -1);
    }

    if (typeof message === 'object' && message instanceof Error) {
      return { context, messageOrError: message };
    }

    if (this.isWrongExceptionsHandlerContract(level, message, params)) {
      const error = new Error(message);
      error.stack = params[0] as string;
      return { context, messageOrError: error };
    }

    return {
      context,
      messageOrError: this.unknownToString(message),
      data: params.length ?? undefined,
    };
  }

  /**
   * Unfortunately built-in (not only) `^.*Exception(s?)Handler$` classes call `.error`
   * method with not supported contract:
   *
   * - ExceptionsHandler
   * @see https://github.com/nestjs/nest/blob/35baf7a077bb972469097c5fea2f184b7babadfc/packages/core/exceptions/base-exception-filter.ts#L60-L63
   *
   * - ExceptionHandler
   * @see https://github.com/nestjs/nest/blob/99ee3fd99341bcddfa408d1604050a9571b19bc9/packages/core/errors/exception-handler.ts#L9
   *
   * - WsExceptionsHandler
   * @see https://github.com/nestjs/nest/blob/9d0551ff25c5085703bcebfa7ff3b6952869e794/packages/websockets/exceptions/base-ws-exception-filter.ts#L47-L50
   *
   * - RpcExceptionsHandler @see https://github.com/nestjs/nest/blob/9d0551ff25c5085703bcebfa7ff3b6952869e794/packages/microservices/exceptions/base-rpc-exception-filter.ts#L26-L30
   *
   * - all of them
   * @see https://github.com/search?l=TypeScript&q=org%3Anestjs+logger+error+stack&type=Code
   */
  private isWrongExceptionsHandlerContract(
    level: ObservabilityLevel,
    message: unknown,
    params: unknown[]
  ): message is string {
    return (
      level === ObservabilityLevel.ERROR &&
      typeof message === 'string' &&
      params.length === 1 &&
      typeof params[0] === 'string' &&
      /\n\s*at /.test(params[0])
    );
  }
}
