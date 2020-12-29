import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../../entity/user.entity';
import { MyHttpException } from '../exception/MyHttpException';
import { ErrorCode } from '../../constants/error';

export class RoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<number[]>('roles', context.getHandler());
        if (!roles) {// 啥意思？
            return true;
        }
        const user = context.switchToHttp().getRequest().user as User;
        const hasRole = (role) => !!roles.find(item => item === role);
        if (user && hasRole(user.role)) {
            return true;
        }
        throw new MyHttpException({
            errorCode: ErrorCode.Forbidden.CODE,
        });
    }

}