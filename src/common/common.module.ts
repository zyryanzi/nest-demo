import { Module } from '@nestjs/common';
import { MyLoggerService } from './logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from '../entity/image.entity';
import { CommonController } from './common.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([ImageEntity]),
    ],
    controllers: [CommonController],
    providers: [MyLoggerService],
    exports: [MyLoggerService],
})
export class CommonModule {}