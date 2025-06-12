import { Test, TestingModule } from '@nestjs/testing';
import { PatientSrvController } from './patient_srv.controller';
import { PatientSrvService } from './patient_srv.service';

describe('PatientSrvController', () => {
  let patientSrvController: PatientSrvController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PatientSrvController],
      providers: [PatientSrvService],
    }).compile();

    patientSrvController = app.get<PatientSrvController>(PatientSrvController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(patientSrvController.getHello()).toBe('Hello World!');
    });
  });
});
