import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import * as url from 'url';
import * as csurf from 'csurf';

const csrfProtection = csurf({
    cookie: true,
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
});

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
    constructor(private readonly configService: ConfigService) {}

    use(request: Request, response: Response, next: () => void): any {
        const req: any = request;
        const res: any = response;
        const pathName = url.parse(req.originalUrl).pathname;
        const trustArr = [
            this.configService.server.apiPrefix + '/common/oss/callback',
        ];
        if (trustArr.indexOf(pathName)) {// 允许
            next();
            return;
        }
        csrfProtection(req, res, next);
    }

}