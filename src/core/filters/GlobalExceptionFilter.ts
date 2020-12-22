import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../../constants/error';
import construct = Reflect.construct;
import { isConstructor } from '@nestjs/common/utils/shared.utils';
import { ConfigService } from '../../config/config.service';
import { MyLoggerService } from '../../common/logger.service';

@Catch()
export class globalExceptionFilter implements ExceptionFilter {
  constructor(private configService: ConfigService,
              private logger: MyLoggerService) {}

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
    }
  }
}
