import { Body, Controller, Get } from '@nestjs/common';
import { CatService } from '../app.service';
import { Cat } from '../provider/cat';
import { CatDto } from '../service/dto/cat.dto';
import { HTTP_MODULE_OPTIONS } from '@nestjs/common/http/http.constants';

@Controller('cats')
export class CatController {
  constructor(private catService: CatService) {}

  @Get('all')
  async findAll(): Promise<Cat[]> {
    return this.catService.findAll();
  }

  async create(@Body() catDto: CatDto) {
    this.catService.create(catDto);
  }
}
