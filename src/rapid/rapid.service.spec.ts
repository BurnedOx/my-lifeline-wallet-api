import { Test, TestingModule } from '@nestjs/testing';
import { RapidService } from './rapid.service';

describe('RapidService', () => {
  let service: RapidService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RapidService],
    }).compile();

    service = module.get<RapidService>(RapidService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
