import { ConfigService } from './config/config.service';
import { MyLoggerService } from './common/logger.service';
import { globalExceptionFilter } from './core/filters/GlobalExceptionFilter';
import * as path from 'path'
import * as nunjucks from 'nunjucks'
import * as viewfilter from './utils/viewfilter'

export default async function bootstrap(app, listening: boolean = true) {
  const configService: ConfigService = app.get(ConfigService);
  const myLoggerService: MyLoggerService = app.get(MyLoggerService);

  myLoggerService.info({
    message: 'Starting my nest project...',
    data: {
      NODE_ENV: process.env.NODE_ENV,
      port: configService.server.port,
    },
  });

  app.useGlobalFilters(new globalExceptionFilter(configService, myLoggerService));

  initView(app);

  if (listening) {
    await app.listen(configService.server.port);
    myLoggerService.info({
      message: 'My nest project started !',
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
  })
  for (const key of Object.keys(viewfilter)){
    nunjucksEnv.addFilter(key, viewfilter[key])
  }

  // macro中不能访问当前 context , 将要访问的变量加到 global
  nunjucksEnv.addGlobal('env', configService.env);
  nunjucksEnv.addGlobal('jsPath', configService.static.jsPath);
}