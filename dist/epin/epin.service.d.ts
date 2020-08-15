import { EPin } from 'src/database/entity/epin.entity';
import { Repository } from 'typeorm';
import { User } from 'src/database/entity/user.entity';
export declare class EpinService {
    private readonly epinRepo;
    private readonly userRepo;
    constructor(epinRepo: Repository<EPin>, userRepo: Repository<User>);
    getAll(status?: 'used' | 'unused'): Promise<import("../interfaces").EpinRO[]>;
    getEpin(userId: string): Promise<import("../interfaces").EpinRO>;
    generate(): Promise<import("../interfaces").EpinRO>;
}
