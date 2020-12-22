import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Observable, of } from 'rxjs';
import { MyDto } from './service/dto/my.dto';
import { Response } from 'express';
import path from 'path';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('html')
  getHtml(@Res() res: Response) {
    console.log('---path: ', path);
    res.sendfile(path.resolve(__dirname, '../', 'static/index.html'));
  }

  @Get('express-json')
  expressJson(@Res() res: Response) {
    res.status(HttpStatus.CREATED).json();
  }

  @Post('express-send')
  expressSend(@Res() res: Response) {
    res.status(HttpStatus.CREATED).send();
  }

  @Get('docs')
  @Redirect('https://www.baidu.com', 302)
  getDocs(@Query('version') version: string) {
    if (version === 'google') {
      return { url: 'https://www.google.com' };
    }
  }

  @Post('dto')
  async createByDTO(@Body() myDto: MyDto) {
    return 'This async one accept dto and return string';
  }

  @Post('update')
  @HttpCode(201)
  @Header('Cache-Control', 'none')
  update(@Req() request): string {
    console.log('--- create a cat: ', request);
    return 'This shoud return code 201 with cache-control:none';
  }

  @Get('all-rxjs')
  findAllRxjs(): Observable<any[]> {
    const res: string[] = [];
    res.join('Marry');
    res.join('Sally');
    return of(res);
  }

  @Get('all-promise')
  async findAllPromise(): Promise<any[]> {
    const res: string[] = [];
    res.join('Marry');
    res.join('Sally');
    return res;
  }

  @Get('param/:id')
  findOne(@Param('id') id: number): string {
    console.log('--- params: ', id);
    return 'This should return No.' + id + ' cat';
  }

  @Post()
  create(@Req() request): string {
    console.log('--- create a cat: ', request);
    return request;
  }

  @Get('hello-again')
  getHelloAgain(@Req() request): string {
    console.log('--- request: ', request);
    return this.appService.getHello();
  }

  @Get('test')
  getHello(): string {
    console.log('--- ? ---');
    return this.appService.getHello();
  }
}
