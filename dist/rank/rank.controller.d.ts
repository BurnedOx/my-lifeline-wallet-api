import { RankService } from './rank.service';
import { RankDTO } from './rank.dto';
import { HeaderDTO } from 'src/common/dto/base-header.dto';
export declare class RankController {
    private readonly rankService;
    constructor(rankService: RankService);
    createRank(data: RankDTO): Promise<string>;
    getRanks(headers: HeaderDTO): Promise<import("../database/entity/rank.entity").Rank[]>;
}
