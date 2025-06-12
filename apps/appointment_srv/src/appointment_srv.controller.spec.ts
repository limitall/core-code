import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentSrvController } from './appointment_srv.controller';
import { AppointmentSrvService } from './appointment_srv.service';

describe('AppointmentSrvController', () => {
  let appointmentSrvController: AppointmentSrvController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentSrvController],
      providers: [AppointmentSrvService],
    }).compile();

    appointmentSrvController = app.get<AppointmentSrvController>(AppointmentSrvController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appointmentSrvController.getHello()).toBe('Hello World!');
    });
  });
});
