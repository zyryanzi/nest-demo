import { Injectable, NestMiddleware } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '../../config/config.service';
import { MyLoggerService } from '../../common/logger.service';

@Injectable()
export class CookieParserMiddleware implements NestMiddleware {
    private readonly cookieParser: any;

    constructor(private readonly configService: ConfigService,
                private readonly logger: MyLoggerService) {
        this.cookieParser = cookieParser(this.configService.server.cookieSecret);
    }

    use(request: Request, response: Response, next: () => void): any {
        const req: any = request;
        const res: any = response;
        this.cookieParser(req, res, next);
    }

}