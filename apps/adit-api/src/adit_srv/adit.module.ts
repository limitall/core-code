import { Module } from '@nestjs/common';
import { Adit } from '@adit/core/decorators';
import { AditService as ADV } from '@adit/lib/adit';
import { AditService } from './adit.service';
import { AditController } from './adit.controller';
import { resources } from './adit.resources';

@Adit({ srvName: ADV.SrvNames.ADIT_SRV, type: 'SrvModuleInit', resources, options: { typeormOptions: { synchronize: false, logging: ['error', 'schema'] }, } })
@Module({
  controllers: [AditController],
  providers: [AditService]
})
export class AditModule { }
