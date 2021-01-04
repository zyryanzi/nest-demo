import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { RedisService } from '../../redis/redis.service';
import { UserService } from '../../user/user.service';
import * as jwt from 'jsonwebtoken';
import { ErrorCode } from '../../constants/error';
import { User } from '../../entity/user.entity';

@Injectable()
export class UserMiddleware implements NestMiddleware {
    constructor(private readonly configService: ConfigService,
                private readonly redisService: RedisService,
                private readonly userService: UserService) {}

    use(request: Request, response: Response, next: () => void): any {
        const req: any = request;
        const res: any = response;
        const tokenName = this.configService.server.tokenName;
        const tokenSecret = this.configService.server.tokenSecret;
        const token: string = req.cookies[tokenName] || '';
        req.user = null;
        if (req.locals != undefined){
            req.locals.user = null;
        }
        if (!token) {
            next();
            return;
        }

        jwt.verify(token, tokenSecret, { algorithms: ['HS256'] }, async (err, payload) => {
            if (err) {
                res.json({
                    errorCode: ErrorCode.TokenError.CODE,
                    message: 'token_error',
                });
                return;
            }
            const userID = (payload as any).id;
            let user: User;
            let userToken: string;
            [user, userToken] = await Promise.all([
                this.redisService.getUser(userID),
                this.redisService.getUserToken(userID),
            ]);

            const isLogin = userToken && token === userToken;

            if (isLogin && !user) {
                user = await this.userService.getUser(userID);
            }

            if (isLogin) {
                req.user = req.local.user = user;
            }

            next();
        });
    }

}