import { Injectable, NestMiddleware } from '@nestjs/common';
import * as compression from 'compression';
import { ConfigService } from '../../config/config.service';
import { MyLoggerService } from '../../common/logger.service';

/**
 * 返回结果压缩
 */
@Injectable()
export class CompressionMiddleware implements NestMiddleware {
    private compression: any;

    constructor(private readonly configService: ConfigService,
                private readonly logger: MyLoggerService,
    ) {
        this.compression = compression();
    }

    use(req: Request, res: Response, next: () => void): any {
        const request: any = req;
        const response: any = res;
        this.compression(request, response, next);
    }

}