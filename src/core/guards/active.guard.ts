import { CanActivate, ExecutionContext } from '@nestjs/common';
import { User, UserStatus } from '../../entity/user.entity';
import { ErrorCode } from '../../constants/error';
import { MyHttpException } from '../exception/MyHttpException';
import { ConfigService } from '../../config/config.service';

export class ActiveGuard implements CanActivate {
    constructor() {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        console.log(JSON.stringify({
            codeline: 'active.guard CanActivate',
            ip: request.clientIp,
            timeLabel: new Date().toLocaleDateString(),
        }));
        const user = request.user as User;
        if (!user) {
            throw new MyHttpException({
                errorCode: ErrorCode.LoginTimeout.CODE,
            });
        }
        if (user.status === UserStatus.Active) {
            return;
        }
        throw new MyHttpException({
            errorCode: ErrorCode.Frozen.CODE,
        });
    }
}