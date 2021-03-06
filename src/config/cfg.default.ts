import * as path from 'path';

const apiPrefix = 'api';
const domain = 'dev.sinodrill.com';
const port = 50504;
const url = `http://${domain}`;
const mDomain = 'dev.m-sinodrill.com';
const mUrl = `http://${mDomain}`;

const staticUrl = url;

export default {
    db: {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        charset: 'utf8mb4',
        username: 'root',
        password: '123456',
        database: 'sinodrill',
        synchronize: false,
        entities: [path.join(__dirname, '../entity/**/*.entity{.ts,.js}')],
        logging: 'all', // query, error, schema, warn, info, log, all
        logger: 'simple-console',
        maxQueryExecutionTime: 500, // 单位毫秒
        autoSchemaSync: true,
    },
    redis: {
        host: 'localhost',
        keyPrefix: 'sinodrill',
        family: 4, // 4 (IPv4) or 6 (IPv6)
        port: '6379',
        password: '',
        db: 0
    },
    static: {
        staticUrl: staticUrl,
        jsPath: `${staticUrl}/src`,
        cssPath: `${staticUrl}/styles`,
        imgPath: `${staticUrl}/images`,
        fontPath: `${staticUrl}/fonts`,
        uploadImgUrl: `${staticUrl}/upload/images`,
        imgFormat: ['jpg', 'jpeg', 'png'],
        imgMaxSize: 3 * 1024 * 1024,
        imgMaxSizeErr: '图片大小不能超过%sM',
    },
    server: {
        siteName: 'Sinodrill',
        companyName: '北京中钻科技协会',
        icp: '京ICP备12345678号',
        url,
        mUrl,
        domain,
        mDomain,
        allowOrigins: [],
        port,
        apiPrefix,
        passSalt: 'GGLwJ8VWmk',
        tokenName: 'token',
        tokenSecret: '@ecHw-a6t040FnoDh2uXk9hQ',
        tokenMaxAge: 7 * 24 * 60 * 60 * 1000, // token多久过期，单位毫秒
        cookieSecret: 'lZhgxV!@c@IUmV7i',
        rateLimitWindowMs: 15 * 60 * 1000, // 时间窗口，单位毫秒
        rateLimitMax: 1000, // limit each IP to rateLimitMax requests per windowMs
        swaggerPrefix: 'api/v1/',
        xiaoceEmail: 'zyryanzi@163.com',
    },
    geetest: {
        geetest_id: '',
        geetest_key: '',
    },
};