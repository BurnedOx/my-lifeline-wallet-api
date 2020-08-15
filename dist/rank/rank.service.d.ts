import { Rank } from 'src/database/entity/rank.entity';
import { Repository } from 'typeorm';
import { User } from 'src/database/entity/user.entity';
import { RankDTO } from './rank.dto';
import { Transaction } from 'src/database/entity/transaction.entity';
export declare class RankService {
    private readonly rankRepo;
    private readonly userRepo;
    private readonly trxRepo;
    private readonly logging;
    constructor(rankRepo: Repository<Rank>, userRepo: Repository<User>, trxRepo: Repository<Transaction>);
    getRanks(userId: string): Promise<Rank[]>;
    generateRanks(userId: string): Promise<void>;
    createRank(data: RankDTO): Promise<string>;
    private getDirectMembersForRank;
    private getRank;
}
