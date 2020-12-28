import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Settings } from '../entity/settings.entity';
import { CommonModule } from '../common/common.module';
import { UserService } from './user.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Settings]),
        CommonModule,
    ],
    controllers: [],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}