import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DbModule } from 'src/db/db.module';
import { MyLoggerModule } from 'src/logger/my-logger.module';

@Module({
  imports: [
    DbModule.register({
      path: 'mockData/users.json',
    }),
    MyLoggerModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
