import BaseConfig from './BaseConfig';
import { Logger, LoggerOptions } from 'typeorm';

export default class DBConfig extends BaseConfig {
  readonly type: 'mysql';
  readonly host: string;
  readonly port: number;
  readonly username: string;
  readonly password: string;
  readonly database: string;
  readonly entities: string[];
  readonly synchronize: boolean;
  readonly logging: LoggerOptions;
  readonly logger: 'advanced-console' | 'simple-console' | 'file' | 'debug' | Logger;
  // If query execution time exceed this given max execution time (in milliseconds) then logger will log this query.
  readonly maxQueryExecutionTime: number;

  constructor(cfg) {
    super(cfg);
    this.database = process.env.NEST_MYSQL_DB || this.database;
    this.username = process.env.NEST_MYSQL_USERNAME || this.username;
    this.password = process.env.NEST_MYSQL_PASSWORD || this.password;
  }
}