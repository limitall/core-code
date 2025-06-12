import { Controller, Get } from '@nestjs/common';
import { AppointmentSrvService } from './appointment_srv.service';

@Controller()
export class AppointmentSrvController {
  constructor(private readonly appointmentSrvService: AppointmentSrvService) {}

  @Get()
  getHello(): string {
    return this.appointmentSrvService.getHello();
  }
}
