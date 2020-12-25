import { Injectable, NestMiddleware } from '@nestjs/common';
import * as helmet from 'helmet';

/**
 * 应用安全
 */
@Injectable()
export class HelmetMiddleware implements NestMiddleware {
    private readonly helmet: any;

    constructor() {
        this.helmet = helmet();
    }

    use(request: Request, response: Response, next: () => void): any {
        const req: any = request;
        const res: any = response;
        this.helmet(req, res, next);
    }

}