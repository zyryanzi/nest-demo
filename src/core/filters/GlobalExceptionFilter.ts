import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../../constants/error';
import { ConfigService } from '../../config/config.service';
import { MyLoggerService } from '../../common/logger.service';

@Catch()
export class globalExceptionFilter implements ExceptionFilter {
    constructor(private configService: ConfigService,
                private logger: MyLoggerService,
    ) {}

    catch(exception: any, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const nestjsMessage = exception.message;
        let errorCode: number;
        let message: string;

        if (exception.code === 'EBADCSRFTOKEN') {
            response.status(HttpStatus.FORBIDDEN).json({
                errorCode: ErrorCode.Forbidden.CODE,
                message: 'Invalide CSRF token !',
            });
            return;
        } else if (exception.getStatus()) {
            //HttpException
            const httpException: HttpException = exception as HttpException;
            if (httpException.message && typeof exception.code !== 'undefined') {
                errorCode = exception.code;
                message = httpException.message || ErrorCode.codeToMessage(errorCode);
            } else {
                const statusCode = httpException.getStatus();
                if (ErrorCode.hasCode(statusCode)) {
                    message = ErrorCode.codeToMessage(statusCode);
                } else {
                    errorCode = ErrorCode.ERROR.CODE;
                    message = ErrorCode.ERROR.MESSAGE;
                }
            }
        } else {
            // 报错
            errorCode = ErrorCode.ERROR.CODE;
            message = ErrorCode.ERROR.MESSAGE;
            this.logger.error({
                message: [exception.message, exception.stack].join('\n'),
            });
        }
        const apiPrefix = this.configService.server.apiPrefix;
        if (errorCode === ErrorCode.LoginTimeout.CODE && request.originalUrl.indexOf(apiPrefix) !== 0) {
            /*const redirectURL = encodeURIComponent(request.originalUrl);
            let url = '/signin';
            if (redirectURL) {
                url = `${url}?miliref=${redirectURL}`;
            }
            response.redirect(url);*/
            this.logger.warn({ message: '进入了重定向部分' });
            return;
        }
        response.status(HttpStatus.OK).json({
            errorCode,
            message,
            data: this.configService.env === this.configService.DEV ? {
                nestjs: nestjsMessage,
            } : null,
        });
    }
}
