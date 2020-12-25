import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { MyLoggerService } from '../../common/logger.service';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
    constructor(private readonly configService: ConfigService,
                private readonly logger: MyLoggerService,
    ) {}

    use(request: Request, response: Response, next: () => void): any {
        const req: any = request;
        const res: any = response;
        if (this.configService.server.allowOrigins.indexOf(req.headers.origin) >= 0) {
            //未跨域
            res.header('Access-Control-Allow-Origin', req.headers.origin);
        }
        res.header('Access-Control-Allow-Method', 'OPTIONS,HEAD,PUT,GET,POST,DELETE');
        next();
    }

}