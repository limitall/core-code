import { Test, TestingModule } from '@nestjs/testing';
import { DemoTaskController } from './demo-task.controller';

describe('DemoTaskController', () => {
  let controller: DemoTaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DemoTaskController],
    }).compile();

    controller = module.get<DemoTaskController>(DemoTaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
