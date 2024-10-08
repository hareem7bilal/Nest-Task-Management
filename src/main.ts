import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { TransformInterceptor } from './transform.interceptor';
import { Logger } from '@nestjs/common';



async function bootstrap() {
  const logger = new Logger()
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new TransformInterceptor())
  const port = process.env.PORT;
  await app.listen(3000);
  logger.log(`Application is listening on port ${port}`)
}
bootstrap();
