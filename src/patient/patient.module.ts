import { Module } from '@nestjs/common';
import { Adit } from '@limitall/core/decorators';
import { AditService } from '@adit/lib/adit';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { resources } from './patient.resources';

@Adit({ srvName: AditService.SrvNames.PATIENT_SRV, type: 'SrvModuleInit', resources })
@Module({
  imports: [],
  controllers: [PatientController],
  providers: [PatientService]
})
export class PatientModule { }
