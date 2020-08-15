import { User } from 'src/database/entity/user.entity';
import { Repository } from 'typeorm';
export declare class MembersService {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    updateSingleLeg(): Promise<string>;
    directMembers(userId: string): Promise<import("../interfaces").MemberRO[]>;
    downlineMembers(userId: string): Promise<import("../interfaces").MemberRO[]>;
    singleLegMembers(userId: string): Promise<import("../interfaces").SingleLegMemberRO[]>;
    private checkUser;
    private getSingleLeg;
}
