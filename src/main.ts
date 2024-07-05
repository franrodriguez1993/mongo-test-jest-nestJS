import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Prohibir datos que no esten en los DTO
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true, // Convertir Query params en numbers
      },
    }),
  );
  app.setGlobalPrefix('/api/');
  await app.listen(3000);
}
bootstrap();
