import { Test, TestingModule } from '@nestjs/testing';
import { AditController } from './adit.controller';

describe('AditController', () => {
  let controller: AditController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AditController],
    }).compile();

    controller = module.get<AditController>(AditController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
