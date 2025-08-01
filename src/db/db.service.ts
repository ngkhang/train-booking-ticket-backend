import { Inject, Injectable } from '@nestjs/common';
import { access, readFile, writeFile } from 'fs/promises';
import { DB_OPTIONS, DbModuleOptions } from './db.module';

@Injectable()
export class DbService {
  constructor(@Inject(DB_OPTIONS) private readonly dbOptions: DbModuleOptions) {}

  public async read<T>(): Promise<T | null> {
    const fileDbPath = this.dbOptions.path;

    try {
      await access(fileDbPath);
      const data = await readFile(fileDbPath, { encoding: 'utf-8' });
      const parsed = JSON.parse(data) as T | undefined;

      return Array.isArray(parsed) ? parsed : null;
    } catch (err) {
      return null;
    }
  }

  public async write(data: Record<string, any>): Promise<void> {
    await writeFile(this.dbOptions.path, JSON.stringify(data), { encoding: 'utf-8' });
  }
}
