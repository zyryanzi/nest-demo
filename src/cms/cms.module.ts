import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Image } from '../entity/image.entity';
import { Settings } from '../entity/settings.entity';
import { IndexController } from './index.controller';
import { UserModule } from '../user/user.module';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Image,
            Settings,
        ]),
        UserModule,
        CommonModule,
    ],
    controllers: [
        IndexController,
    ],
    providers: [],
    exports: [],
})
export class CmsModule {}
