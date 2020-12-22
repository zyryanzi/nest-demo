import { Inject, Injectable, Optional } from '@nestjs/common';

@Injectable()
export class CreateDatabaseProviders {
  constructor(private url: string) {}
}

export function createDatabaseProviders(entitis: any[], options) {
  return [];
}
