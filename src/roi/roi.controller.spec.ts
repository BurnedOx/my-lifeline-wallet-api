import { Test, TestingModule } from '@nestjs/testing';
import { RoiController } from './roi.controller';

describe('Roi Controller', () => {
  let controller: RoiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoiController],
    }).compile();

    controller = module.get<RoiController>(RoiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
