import { Attributes, CommonAttributes } from '@nestjs-observability/spec';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import { randomUUID } from 'crypto';
import {
  MODULE_OPTIONS_TOKEN,
  ObservabilityLevel,
  ObservabilityLevelValue,
  ObservabilityModuleOptions,
} from './core.options';
import { ObservabilityProviderService } from './provider.service';

@Injectable({ scope: Scope.TRANSIENT })
export class ObservabilityService {
  private context = 'UnknownContext';

  constructor(
    @Inject(INQUIRER) private readonly parentClass: unknown,
    private readonly providerService: ObservabilityProviderService,
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: ObservabilityModuleOptions
  ) {
    if (this.parentClass?.constructor?.name) {
      this.setContext(this.parentClass.constructor.name);
    }
  }

  /**
   * Set error information.
   * This should not be used in itself,
   * it's better to use captureError or captureWarning instead.
   */
  private setError(error: Error | string): {
    errorId: string;
  } {
    const errorId = randomUUID();

    // If error is string, use it as error name.
    const errorName = error instanceof Error ? error.name : error;
    // If error is string, we don't set this.
    const errorMessage = error instanceof Error ? error.message : undefined;

    this.providerService.setAttributes(this.context, {
      [CommonAttributes.ERROR_ID]: errorId,
      [CommonAttributes.ERROR_NAME]: errorName,
      [CommonAttributes.ERROR_MESSAGE]: errorMessage,
    });

    return { errorId };
  }

  // If configuredLevel is less or equal the compared level.
  // Then the compared level is enabled.
  isLogLevelEnabled(comparedLevel: ObservabilityLevel): boolean {
    return (
      ObservabilityLevelValue[this.options.level] <=
      ObservabilityLevelValue[comparedLevel]
    );
  }

  isLogLevelDisabled(comparedLevel: ObservabilityLevel): boolean {
    return !this.isLogLevelEnabled(comparedLevel);
  }

  setContext(context: string) {
    this.context = context;
  }

  inject<T>(fun: () => Promise<T>): Promise<T> {
    return this.providerService.inject(async () => {
      try {
        return await fun();
      } catch (error) {
        this.providerService.captureError(this.context, error);
        throw error;
      }
    });
  }

  setAttributes(attributes: Attributes): void {
    this.providerService.setAttributes(this.context, attributes);
  }

  debug(message: string, data?: unknown, attributes?: Attributes): void {
    if (this.isLogLevelDisabled(ObservabilityLevel.DEBUG)) {
      return;
    }

    this.providerService.captureDebug(this.context, message, data, attributes);
  }

  info(message: string, data?: unknown, attributes?: Attributes): void {
    if (this.isLogLevelDisabled(ObservabilityLevel.INFO)) {
      return;
    }

    this.providerService.captureInfo(this.context, message, data, attributes);
  }

  warning(
    messageOrError: string | Error,
    data?: unknown,
    attributes?: Attributes
  ): { errorId: string } {
    const { errorId } = this.setError(messageOrError);

    if (this.isLogLevelDisabled(ObservabilityLevel.WARN)) {
      return { errorId };
    }

    this.providerService.captureWarning(
      this.context,
      messageOrError,
      data,
      attributes
    );

    return { errorId };
  }

  error(
    messageOrError: string | Error,
    data?: unknown,
    attributes?: Attributes
  ): { errorId: string } {
    const { errorId } = this.setError(messageOrError);

    if (this.isLogLevelDisabled(ObservabilityLevel.ERROR)) {
      return { errorId };
    }

    this.providerService.captureError(
      this.context,
      messageOrError,
      data,
      attributes
    );

    return { errorId };
  }
}
