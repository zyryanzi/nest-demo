import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { MyLoggerService } from '../common/logger.service';
import { ConfigService } from '../config/config.service';
import { UserService } from '../user/user.service';
import { MyRequest } from '../core/type/net';

@Controller()
export class IndexController {
    constructor(
        private readonly logger: MyLoggerService,
        private readonly configService: ConfigService,
        private readonly userService: UserService,
    ) {}

    @Get('/')
    async index(@Query('sort') sort: string, @Req() req, @Res() res) {

        this.logger.info({
            data: {
                the_code_line: `index view sort: ${sort}`,
                ip: (req as MyRequest).clientIp,
            },
        });

        this.logger.info({
            data: {
                the_code_line: `index render view`,
                ip: (req as MyRequest).clientIp,
            },
        });

        res.render('page/index', {});
    }

}