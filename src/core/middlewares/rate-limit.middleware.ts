import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import * as rateLimit from 'express-rate-limit';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
    private readonly rateLimit: any;

    constructor(private readonly configService: ConfigService) {
        this.rateLimit = rateLimit({
            windowMs: this.configService.server.rateLimitWindowMs,
            max: this.configService.server.rateLimitMax,
        });
    }

    use(request: Request, response: Response, next: () => void): any {
        const req: any = request;
        const res: any = response;

        this.rateLimit(req, res, next);
    }

}