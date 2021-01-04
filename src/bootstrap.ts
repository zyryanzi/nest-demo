import { ConfigService } from './config/config.service';
import { MyLoggerService } from './common/logger.service';
import { globalExceptionFilter } from './core/filters/GlobalExceptionFilter';
import * as path from 'path';
import * as nunjucks from 'nunjucks';
import * as viewfilter from './utils/viewfilter';
import { TransformResInterceptor } from './core/interceptors/transform-res.interceptor';
import { ValidateDtoPipe } from './core/pipes/validate-dto.pipe';

export default async function bootstrap(app, listening: boolean = true) {
    const configService: ConfigService = app.get(ConfigService);
    const myLoggerService: MyLoggerService = app.get(MyLoggerService);

    myLoggerService.info({
        message: 'Starting my nest project...',
    });

    // app.setGlobalPrefix(configService.server.apiPrefix);

    app.useGlobalPipes(new ValidateDtoPipe(configService));
    app.useGlobalInterceptors(new TransformResInterceptor(configService, myLoggerService));
    app.useGlobalFilters(new globalExceptionFilter(configService, myLoggerService));

    initView(app);

    if (listening) {
        await app.listen(configService.server.port);
        myLoggerService.info({
            message: 'My nest project started !',
            data: {
                NODE_ENV: process.env.NOD_ENV,
                port: configService.server.port,
                apiPrefix: configService.server.apiPrefix,
            },
        });
    }
}

function initView(app) {
    const configService = app.get(ConfigService);
    const viewPath = path.join(__dirname, '../views');
    app.setBaseViewsDir(viewPath);
    app.setViewEngine('njk');
    const nunjucksEnv = nunjucks.configure(viewPath, {
        noCache: process.env.NODE_ENV === configService.DEV,
        autoescape: true,
        express: app,
    });
    for (const key of Object.keys(viewfilter)) {
        nunjucksEnv.addFilter(key, viewfilter[key]);
    }

    // macro中不能访问当前 context , 将要访问的变量加到 global
    nunjucksEnv.addGlobal('env', configService.env);
    nunjucksEnv.addGlobal('jsPath', configService.static.jsPath);
}