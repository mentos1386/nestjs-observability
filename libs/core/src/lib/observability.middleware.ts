import { Injectable, NestMiddleware } from '@nestjs/common';
import { ObservabilityService } from './observability.service';

@Injectable()
export class ObservabilityMiddleware implements NestMiddleware {
  constructor(private readonly observabilityService: ObservabilityService) {}

  use(_req: unknown, _res: unknown, next: (error?: unknown) => void) {
    this.observabilityService.inject(async () => next());
  }
}
