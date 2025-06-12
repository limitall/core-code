import { Controller, Get } from '@nestjs/common';
import { PatientSrvService } from './patient_srv.service';

@Controller()
export class PatientSrvController {
  constructor(private readonly patientSrvService: PatientSrvService) {}

  @Get()
  getHello(): string {
    return this.patientSrvService.getHello();
  }
}
