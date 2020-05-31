import { Test, TestingModule } from '@nestjs/testing';
import { RoiService } from './roi.service';

describe('RoiService', () => {
  let service: RoiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoiService],
    }).compile();

    service = module.get<RoiService>(RoiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
