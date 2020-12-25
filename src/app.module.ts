import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from './redis/redis.module';
import { AppController } from './app.controller';
import { CatController } from './controller/cat.controller';
import { IpMiddleware } from './core/middlewares/ip.middleware';
import { CompressionMiddleware } from './core/middlewares/compression.middleware';
import { CookieParserMiddleware } from './core/middlewares/cookie-parser.middleware';
import { CorsMiddleware } from './core/middlewares/cors.middleware';
import { CsrfMiddleware } from './core/middlewares/csrf.middleware';
import { RateLimitMiddleware } from './core/middlewares/rate-limit.middleware';
import { HelmetMiddleware } from './core/middlewares/helmet.middleware';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
            useFactory: async (configService: ConfigService) => {
                // typeorm bug, https://github.com/nestjs/nest/issues/1119
                // 将 type 定义为 type: 'mysql' | 'mariadb'; 解决此issue
                return configService.db;
            },
            inject: [ConfigService],
        }),
        RedisModule.forRootAsync({
            useFactory: async (configService: ConfigService): Promise<ConfigService> => {
                return configService;
            },
            inject: [ConfigService],
        }),
        CommonModule,
    ],
    // controllers: [AppController, CatController],
    // providers: [AppService, CatService, HttpService],
})

export class AppModule implements NestModule {
    constructor(private readonly configService: ConfigService) {}

    configure(consumer: MiddlewareConsumer): any {
        const middlewares = [
            IpMiddleware,
            CookieParserMiddleware,
            RateLimitMiddleware,
            CorsMiddleware,
            CsrfMiddleware,
            HelmetMiddleware,
            CompressionMiddleware,
        ];
        consumer
            .apply(...middlewares)
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
