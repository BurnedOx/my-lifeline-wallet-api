import { Test, TestingModule } from '@nestjs/testing';
import { EpinHistoryController } from './epin-history.controller';

describe('EpinHistory Controller', () => {
  let controller: EpinHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EpinHistoryController],
    }).compile();

    controller = module.get<EpinHistoryController>(EpinHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
