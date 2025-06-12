
import { Logger } from '@nestjs/common';
import { GrpcServer } from '@adit/core/decorators';
import { GetMetadata } from '@adit/core/common';
import { AditService } from '@adit/lib/adit'
import { AppModule } from './app.module';


export class Adit {
  constructor() {
  }

  @GrpcServer({ srvName: AditService.SrvNames.ADIT_SRV, srvModule: AppModule })
  static appServer(): any { }
}

async function bootstrap() {
  (await Adit.appServer()).listen().then(() => {
    Logger.log(GetMetadata(Adit, "GrpcServer", 'appServer'));
  });
}
bootstrap();
