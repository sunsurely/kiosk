import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ItemsOptionsService } from './items/itemsOption.service';
import { TransformInterceptor } from './interceptors/transformInterceptor';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(3000);

  const itemsOption = app.get(ItemsOptionsService);
  await itemsOption.initCachedOptions();
}
bootstrap();
