import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawlService } from './withdrawl.service';

describe('WithdrawlService', () => {
  let service: WithdrawlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WithdrawlService],
    }).compile();

    service = module.get<WithdrawlService>(WithdrawlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
