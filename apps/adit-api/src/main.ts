
import { Logger } from '@nestjs/common';
import { GrpcServer } from '@adit/core/decorators';
import { GetMetadata } from '@adit/core/common';
import { AditService } from '@adit/lib/adit'
import { AppModule } from './app.module';


export class Patient {
  constructor() {
  }

  @GrpcServer({ srvName: AditService.SrvNames.PATIENT_SRV, srvModule: AppModule })
  static appServer(): any { }
}

async function bootstrap() {
  (await Patient.appServer()).listen().then(() => {
    Logger.log(GetMetadata(Patient, "GrpcServer", 'appServer'));
  });
}
bootstrap();
