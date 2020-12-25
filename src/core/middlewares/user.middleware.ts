import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { RedisService } from '../../redis/redis.service';
import { UserService } from '../../user/user.service';

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
        req.locals.user = null;
        if (!token) {
            next();
            return;
        }
    }

}