import { NestFactory } from '@nestjs/core';
import { PatientSrvModule } from './patient_srv.module';

export class Patient {
  constructor() {
  }

  @GrpcServer({ srvName: AditService.SrvNames.ADIT_SRV, srvModule: AppModule })
  static appServer(): any { }
}

async function bootstrap() {
  const app = await NestFactory.create(PatientSrvModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
