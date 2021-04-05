import { Test, TestingModule } from '@nestjs/testing';
import { EpinHistoryService } from './epin-history.service';

describe('EpinHistoryService', () => {
  let service: EpinHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EpinHistoryService],
    }).compile();

    service = module.get<EpinHistoryService>(EpinHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
