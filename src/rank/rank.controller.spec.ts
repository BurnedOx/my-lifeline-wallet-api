import { Test, TestingModule } from '@nestjs/testing';
import { RankController } from './rank.controller';

describe('Rank Controller', () => {
  let controller: RankController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankController],
    }).compile();

    controller = module.get<RankController>(RankController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
