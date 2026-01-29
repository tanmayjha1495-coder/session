import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('Starting Application...', process.env.MONGO_HOST);
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/sessions');
  await app.listen(process.env.PORT || 3001);
}

bootstrap();