import { Module } from '@nestjs/common';
import { MyLoggerService } from './logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from '../entity/image.entity';
import { CommonController } from './common.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Image]),
    ],
    controllers: [CommonController],
    providers: [MyLoggerService],
    exports: [MyLoggerService],
})
export class CommonModule {}