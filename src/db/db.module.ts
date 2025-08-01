import { DynamicModule, Module } from '@nestjs/common';
import { DbService } from './db.service';

export const DB_OPTIONS = 'DB_OPTIONS';

export interface DbModuleOptions {
  path: string;
}

@Module({})
export class DbModule {
  static register(dbOptions: DbModuleOptions): DynamicModule {
    return {
      module: DbModule,
      providers: [
        {
          provide: DB_OPTIONS,
          useValue: dbOptions,
        },
        DbService,
      ],
      exports: [DbService],
    };
  }
}
