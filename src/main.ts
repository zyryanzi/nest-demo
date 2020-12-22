import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import bootstrap from './bootstrap';

async function main() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'dev' ? new Logger() : false,
  });
  // const app = await NestFactory.create<NestFastifyApplication>(AppModule);
  // await app.listen(3000);
  await bootstrap(app);
}

main();