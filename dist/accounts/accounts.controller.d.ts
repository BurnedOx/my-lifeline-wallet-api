import { AccountsService } from './accounts.service';
import { RegistrationDTO, LoginDTO, AdminRegistrationDTO, UpdatePasswordDTO, ProfileDTO, BankDTO } from './accounts.dto';
import { HeaderDTO } from 'src/common/dto/base-header.dto';
export declare class AccountsController {
    private readonly accountsService;
    constructor(accountsService: AccountsService);
    getAllUsers(): Promise<import("../interfaces").UserRO[]>;
    getUser(id: string): import("rxjs").Observable<import("../interfaces").UserRO>;
    registerAdmin(data: AdminRegistrationDTO): Promise<import("../interfaces").UserRO>;
    loginAdmin(data: LoginDTO): Promise<import("../interfaces").UserRO>;
    register(data: RegistrationDTO): Promise<import("../interfaces").UserRO>;
    login(data: LoginDTO): Promise<import("../interfaces").UserRO>;
    getDetails(headers: HeaderDTO): Promise<import("../interfaces").UserDetailsRO>;
    getDetailsByAdmin(id: string): Promise<import("../interfaces").UserDetailsRO>;
    activateAccount(id: string, headers: HeaderDTO): Promise<import("../interfaces").UserRO>;
    updateProfile(data: ProfileDTO, headers: HeaderDTO): Promise<string>;
    updateProfileByAdmin(data: ProfileDTO, userId: string): Promise<string>;
    changePassword(data: UpdatePasswordDTO, headers: HeaderDTO): Promise<string>;
    forgotPassword(userId: string, password: string): Promise<string>;
    updateBankDetails(data: BankDTO, headers: HeaderDTO): Promise<string>;
    updateBankDetailsByAdmin(id: string, data: BankDTO): Promise<string>;
    updateSponsor(sponsorId: string, id: string): Promise<import("../interfaces").UserRO>;
    resetWallets(): Promise<string>;
    deleteUser(id: string): Promise<string>;
}
