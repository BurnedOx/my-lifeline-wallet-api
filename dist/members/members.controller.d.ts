import { MembersService } from './members.service';
import { HeaderDTO } from 'src/common/dto/base-header.dto';
export declare class MembersController {
    private readonly membersService;
    constructor(membersService: MembersService);
    directMembers(headers: HeaderDTO): Promise<import("../interfaces").MemberRO[]>;
    adminGetDirect(id: string): Promise<import("../interfaces").MemberRO[]>;
    downlineMembers(headers: HeaderDTO): Promise<import("../interfaces").MemberRO[]>;
    singleLegMembers(headers: HeaderDTO): Promise<import("../interfaces").SingleLegMemberRO[]>;
    getAdminSingleLeg(id: string): Promise<import("../interfaces").SingleLegMemberRO[]>;
    updateSingleLeg(): Promise<string>;
}
