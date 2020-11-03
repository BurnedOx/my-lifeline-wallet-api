import { Test, TestingModule } from '@nestjs/testing';
import { RapidController } from './rapid.controller';

describe('Rapid Controller', () => {
  let controller: RapidController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RapidController],
    }).compile();

    controller = module.get<RapidController>(RapidController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
