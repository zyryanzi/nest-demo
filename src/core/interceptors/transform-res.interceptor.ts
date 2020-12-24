import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '../../config/config.service';
import { MyLoggerService } from '../../common/logger.service';
import { map } from 'rxjs/operators';
import { MyRequest } from '../type/net';
import { ErrorCode } from '../../constants/error';

@Injectable()
export class TransformResInterceptor<T> implements NestInterceptor {
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: MyLoggerService,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        this.logger.info({ 'message': '进入interceptor' });
        return next.handle().pipe(map(async (data) => {
            const req = context.switchToHttp().getRequest<MyRequest>();
            const reqEndTime = Date.now();
            const responseTime = reqEndTime - req.reqStartTime;
            this.logger.info({
                data: {
                    req: {
                        method: req.method,
                        url: req.originalUrl,
                        headers: {
                            'user-agent': req.headers['user-agent'],
                        },
                    },
                    ip: req.clientIp,
                    responseTime,
                },
            });
            if (typeof data === 'undefined') {
                // 请求页面时进入这里？
                return data;
            }
            const newData = data as any;

            // if (req.query && req.query.json === this.configService.server.viewDataSecret) {
            //     return newData;
            // }

            if (typeof newData.statusCode === 'undefined') {
                return {
                    data: newData,
                    errorCode: ErrorCode.SUCCESS.CODE,
                    message: 'success',
                };
            }
            let errorCode, message;
            if (ErrorCode.hasCode(newData.statusCode)) {
                errorCode = newData.statusCode;
                message = ErrorCode.codeToMessage(errorCode);
            } else {
                errorCode = ErrorCode.ERROR.CODE;
                message = ErrorCode.ERROR.MESSAGE;
            }
            return {
                errorCode,
                message,
                data: this.configService.env === this.configService.DEV ? {
                    nestjs: newData.message,
                } : null,
            };
        }));
    }
}