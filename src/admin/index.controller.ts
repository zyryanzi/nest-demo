import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ActiveGuard } from '../core/guards/active.guard';
import { RoleGuard } from '../core/guards/role.guard';
import { Roles } from '../core/decorators/roles.decorator';
import { MyLoggerService } from '../common/logger.service';
import { UserRole } from '../entity/user.entity';

@Controller()
export class IndexController {
    constructor(private readonly logger: MyLoggerService) {}

    @Get('/admin/*')
    @UseGuards(ActiveGuard, RoleGuard)
    @Roles(UserRole.Admin, UserRole.Leader, UserRole.Super)
    async adminIndex(@Req() req, @Res() res) {
        this.logger.info({
            data: {
                middleware: 'adminIndex',
                ip: req.clientIp,
            },
        });
        res.render('pages/admin/app', {
            adminPageUrl: '/admin'
        })
    }
}