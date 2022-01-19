import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const cors = {
    origin: ['*'],
  };

  const app = await NestFactory.create(AppModule, { cors });
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
