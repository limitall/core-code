import { Module } from '@nestjs/common';
import { AppointmentSrvController } from './appointment_srv.controller';
import { AppointmentSrvService } from './appointment_srv.service';

@Module({
  imports: [],
  controllers: [AppointmentSrvController],
  providers: [AppointmentSrvService],
})
export class AppointmentSrvModule {}
