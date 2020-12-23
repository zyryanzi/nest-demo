import { Global, Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { RedisService } from './redis.service';

@Global()
@Module({})
export class RedisModule {
  static forRootAsync(options) {
    const providers = [
      {
        provide: 'RedisModuleOptions',
        useFactory: options.useFactory,
        inject: options.inject,
      },
      {
        provide: RedisService,
        useFactory: (configService: ConfigService) => {
          return new RedisService(configService);
        },
        inject: ['RedisModuleOptions'],
      },
    ];

    return {
      module: RedisModule,
      providers,
      exports: providers,
    };
  }
}