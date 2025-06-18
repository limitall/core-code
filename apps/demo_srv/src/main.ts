
import { Logger } from '@nestjs/common';
import { GrpcServer } from '@adit/core/decorators';
import { GetMetadata } from '@adit/core/common';
import { AditService } from '@adit/lib/adit'
import { DemoSRVModule } from './demo_srv.module';


export class Demo {
  constructor() {
  }

  @GrpcServer({ srvName: AditService.SrvNames.DEMO_SRV, srvModule: DemoSRVModule })
  static appServer(): any { }
}

async function bootstrap() {
  (await Demo.appServer()).listen().then(() => {
    Logger.log(GetMetadata(Demo, "GrpcServer", 'appServer'));
  });
}
bootstrap();
