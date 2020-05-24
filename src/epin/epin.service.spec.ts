import { Test, TestingModule } from '@nestjs/testing';
import { EpinService } from './epin.service';

describe('EpinService', () => {
  let service: EpinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EpinService],
    }).compile();

    service = module.get<EpinService>(EpinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
