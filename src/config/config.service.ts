import * as _ from 'lodash';
import devJSON from './cfg.dev';
import testJSON from './cfg.test';
import prdJSON from './cfg.prd';
import defaultJSON from './cfg.default';
import DBConfig from './type/DBConfig';
import RedisConfig from './type/RedisConfig';
import StaticConfig from './type/StaticConfig';
import ServerConfig from './type/ServerConfig';
import { GeetestConfig } from './type/GeetestConfig';

export class ConfigService {
    readonly DEV = 'dev';
    readonly TEST = 'test';
    readonly PRD = 'prd';

    readonly env: string;

    readonly db: DBConfig;
    readonly redis: RedisConfig;
    readonly static: StaticConfig;
    readonly server: ServerConfig;
    readonly geetest: GeetestConfig

    constructor() {
        const envConfigMap = {
            dev: devJSON,
            test: testJSON,
            prd: prdJSON,
        };
        const curCfg = envConfigMap[process.env.NODE_ENV];
        if (curCfg) {
            _.merge(defaultJSON, curCfg);
            this.env = process.env.NODE_ENV;
        } else {
            this.env = this.DEV;
        }
        this.db = new DBConfig(defaultJSON.db);
        if (this.env !== this.DEV && this.db.synchronize) {
            process.exit(-1);
        }
        this.redis = new RedisConfig(defaultJSON.redis);
        this.static = new StaticConfig(defaultJSON.static);
        this.server = new ServerConfig(defaultJSON.server);
        this.geetest = new GeetestConfig(defaultJSON.geetest);
    }
}