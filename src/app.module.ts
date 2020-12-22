import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService, CatService, HttpService } from './app.service';
import { CatController } from './controller/cat.controller';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        // typeorm bug, https://github.com/nestjs/nest/issues/1119
        // 将 type 定义为 type: 'mysql' | 'mariadb'; 解决此issue
        return configService.db;
      },
    }),
    CommonModule,
  ],
  controllers: [AppController, CatController],
  providers: [AppService, CatService, HttpService],
})
export class AppModule {}
