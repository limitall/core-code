
import { Logger } from '@nestjs/common';
import { GrpcServer, Adit } from '@limitall/core/decorators';
import { GetMetadata } from '@limitall/core/common';
import { AditService } from '@adit/lib/adit'
import { AppModule } from './app.module';
export class Patient {
  constructor() {
  }

  @GrpcServer({ srvName: AditService.SrvNames.PATIENT_SRV, srvModule: AppModule, options: {} })
  static appServer(): any { }

  // @Grpc('sdf4')
  // public static abc;

  // @Grpc({ a: 1, b: 2 })
  // public static def;

  // @Grpc([1, 2, 3, 4])
  // public static ghi;

  // @Grpc('PatientApp', 'app', 'patient')
  // public static jkl;

  // @Grpc()
  // public static mno;
}

async function bootstrap() {
  (await Patient.appServer()).listen().then(() => {
    Logger.log(GetMetadata(Patient, "GrpcServer", 'appServer'));
  });
}
bootstrap();
