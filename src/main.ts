import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { storeUploadFile } from './user/oss';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.useStaticAssets(join(__dirname, `../${storeUploadFile}`), {
    prefix: `/${storeUploadFile}`,
  });
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
