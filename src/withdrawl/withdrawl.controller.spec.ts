import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawlController } from './withdrawl.controller';

describe('Withdrawl Controller', () => {
  let controller: WithdrawlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WithdrawlController],
    }).compile();

    controller = module.get<WithdrawlController>(WithdrawlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
