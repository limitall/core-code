import { Test, TestingModule } from '@nestjs/testing';
import { AditService } from './adit.service';

describe('AditService', () => {
  let service: AditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AditService],
    }).compile();

    service = module.get<AditService>(AditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
