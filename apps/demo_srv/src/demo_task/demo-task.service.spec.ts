import { Test, TestingModule } from '@nestjs/testing';
import { DemoTaskService } from './demo-task.service';

describe('DemoTaskService', () => {
  let service: DemoTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DemoTaskService],
    }).compile();

    service = module.get<DemoTaskService>(DemoTaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
