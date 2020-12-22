import { Inject, Injectable, Optional } from '@nestjs/common';
import { Cat } from './provider/cat';
import { CatDto } from './service/dto/cat.dto';
import { deepMerge } from './utils/obj.util';
import construct = Reflect.construct;

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

@Injectable()
export class CatService {
  private readonly catDtos: CatDto[] = [];
  private readonly cats: Cat[];

  create(catDto: CatDto) {
    let cat;
    deepMerge(cat, catDto);
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    deepMerge(this.cats, this.catDtos);
    return this.cats;
  }
}

@Injectable()
export class HttpService<T> {
  constructor(@Optional() @Inject('HTTP_MODULE_OPTIONS') private httpClient: T) {}
}
