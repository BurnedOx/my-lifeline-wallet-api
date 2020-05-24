import { Test, TestingModule } from '@nestjs/testing';
import { EpinController } from './epin.controller';

describe('Epin Controller', () => {
  let controller: EpinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EpinController],
    }).compile();

    controller = module.get<EpinController>(EpinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
