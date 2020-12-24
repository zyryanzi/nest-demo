import { ArgumentMetadata, Injectable, PipeTransform, ValidationError } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { MyHttpException } from '../exception/MyHttpException';
import { ErrorCode } from '../../constants/error';

@Injectable()
export class ValidateDtoPipe implements PipeTransform<any> {
    constructor(private readonly configService: ConfigService) {}

    async transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type !== 'body') {
            return value;
        }
        const { metatype } = metadata;
        // 如果参数不是 类 而是普通的 JavaScript 对象则不进行验证
        if (!metatype || this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object, { whitelist: true });
        if (!errors || errors.length <= 0) {
            return object;
        }

        let message;
        let errorCode;
        this.assignErrCode(errors, errorCode, message);

        throw new MyHttpException({
            errorCode: errorCode || ErrorCode.ParamsError.CODE,
            message,
        });
    }

    private assignErrCode(errors, errorCode, message) {
        if (errors[0].constraints) {
            for (const key of Object.keys(errors[0].constraints)) {
                message = errors[0].constraints[key];
                const contexts = errors[0].contexts;
                if (contexts && typeof contexts[key] !== 'undefined' && contexts[key].errorCode !== 'undefined') {
                    errorCode = contexts[key].errorCode;
                }
                break;
            }
        } else {
            const children = errors[0].children;
            this.assignErrCode(children, errorCode, message);
        }
    }

    private toValidate(metatype): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find(type => metatype === type);
    }

}