import { NestFactory } from '@nestjs/core';
import { PatientSrvModule } from './patient_srv.module';

async function bootstrap() {
  const app = await NestFactory.create(PatientSrvModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
