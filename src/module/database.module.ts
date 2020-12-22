import { DynamicModule, Module } from '@nestjs/common';
import {
  CreateDatabaseProviders,
  createDatabaseProviders,
} from '../service/database.providers';

@Module({ providers: [CreateDatabaseProviders] })
export class DatabaseModule {
  // forRoot 返回一个同步或异步的模块
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(entities, options);
    return {
      global: true,
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}
