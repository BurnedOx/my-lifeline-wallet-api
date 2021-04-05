import { Test, TestingModule } from '@nestjs/testing';
import { UserEpinService } from './user-epin.service';

describe('UserEpinService', () => {
  let service: UserEpinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserEpinService],
    }).compile();

    service = module.get<UserEpinService>(UserEpinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
