import * as requestIp from 'request-ip';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { MyLoggerService } from '../../common/logger.service';
import { MyRequest } from '../type/net';

@Injectable()
export class IpMiddleware implements NestMiddleware {
    constructor(private readonly logger: MyLoggerService) {}

    use(request: any, response: any, next: () => void): any {
        const req: MyRequest = request as any;
        req.reqStartTime = Date.now();

        const clientIp = requestIp.getClientIp(request as any);
        (request as any).clientIp = clientIp;

        this.logger.info({
            data: {
                middleware: 'IpMiddleware',
                ip: clientIp,
                req: {
                    method: req.method,
                    url: req.originalUrl,
                    headers: {
                        'user-agent': req.headers['user-agent'],
                    },
                },
            },
        });
        next();
    }
}