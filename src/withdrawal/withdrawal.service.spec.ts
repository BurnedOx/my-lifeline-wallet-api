import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawalService } from './withdrawal.service';

describe('WithdrawlService', () => {
  let service: WithdrawalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WithdrawalService],
    }).compile();

    service = module.get<WithdrawalService>(WithdrawalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
