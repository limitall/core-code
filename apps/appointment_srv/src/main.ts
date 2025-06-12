import { NestFactory } from '@nestjs/core';
import { AppointmentSrvModule } from './appointment_srv.module';

async function bootstrap() {
  const app = await NestFactory.create(AppointmentSrvModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
