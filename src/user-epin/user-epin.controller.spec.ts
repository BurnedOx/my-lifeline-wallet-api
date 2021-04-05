import { Test, TestingModule } from '@nestjs/testing';
import { UserEpinController } from './user-epin.controller';

describe('UserEpin Controller', () => {
  let controller: UserEpinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserEpinController],
    }).compile();

    controller = module.get<UserEpinController>(UserEpinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
