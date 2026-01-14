import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({
    origin: process.env['CORS_ORIGIN'] || 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Truck Fleet Manager API')
    .setDescription('API per la gestione della flotta di camion')
    .setVersion('1.0')
    .addTag('vehicles', 'Gestione veicoli')
    .addTag('drivers', 'Gestione autisti')
    .addTag('clients', 'Gestione clienti')
    .addTag('trips', 'Gestione viaggi')
    .addTag('invoices', 'Gestione fatture')
    .addTag('fuel', 'Gestione rifornimenti')
    .addTag('maintenance', 'Gestione manutenzioni')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env['PORT'] || 3000;
  await app.listen(port);

  console.log(`🚚 Truck Fleet API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs available at http://localhost:${port}/api/docs`);
}

bootstrap();
