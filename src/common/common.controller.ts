import { ConfigService } from '../config/config.service';
import { Controller, Get } from '@nestjs/common';

@Controller('common')
export class CommonController {
  constructor(private configService: ConfigService) {}

  @Get('test')
  getHello(): string {
    console.log('--- ? ---');
    return 'hello, nest!';
  }
}