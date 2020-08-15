import { WithdrawalService } from './withdrawal.service';
import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { WithdrawalDTO } from './withdrawal.dto';
import { ParamIds } from 'src/common/dto/multi-ids.dto';
export declare class WithdrawalController {
    private readonly withdrawlService;
    constructor(withdrawlService: WithdrawalService);
    getByUserId(headers: HeaderDTO): Promise<import("../interfaces").WithdrawalRO[]>;
    getAll(status?: 'paid' | 'unpaid' | 'cancelled'): Promise<{
        fromId: string;
        fromName: string;
        id: string;
        withdrawAmount: number;
        netAmount: number;
        processedAt: Date;
        paymentType: string;
        status: "paid" | "unpaid" | "cancelled";
        createdAt: Date;
        updatedAt: Date;
        accountName: string;
        bankName: string;
        accountNumber: number;
        isfc: string;
        accountType: string;
    }[]>;
    create(headers: HeaderDTO, data: WithdrawalDTO): Promise<import("../interfaces").WithdrawalRO>;
    update(id: string, status: 'paid' | 'unpaid' | 'cancelled'): Promise<string>;
    pay(params: ParamIds): Promise<string>;
    unpay(params: ParamIds): Promise<string>;
    cancel(params: ParamIds): Promise<string>;
}
