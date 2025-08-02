import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { storeUploadFile } from './user/oss';
import { MyLoggerService } from './logger/my-logger.service';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new MyLoggerService(),
  });

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(); // Enable to test upload file with frontend
  app.useStaticAssets(join(__dirname, `../${storeUploadFile}`), {
    prefix: `/${storeUploadFile}`,
  });
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
