import { Module } from '@nestjs/common';
import { PatientSrvController } from './patient_srv.controller';
import { PatientSrvService } from './patient_srv.service';

@Module({
  imports: [],
  controllers: [PatientSrvController],
  providers: [PatientSrvService],
})
export class PatientSrvModule {}
