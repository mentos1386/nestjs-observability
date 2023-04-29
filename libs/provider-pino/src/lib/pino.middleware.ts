import { Injectable, NestMiddleware } from '@nestjs/common';
import { ProviderPino } from './pino.provider';

@Injectable()
export class ProviderPinoMiddleware implements NestMiddleware {
  constructor(private readonly providerPino: ProviderPino) {}

  use(_req: unknown, _res: unknown, next: (error?: unknown) => void) {
    this.providerPino.inject(async () => next());
  }
}
