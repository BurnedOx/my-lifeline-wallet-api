import { HeaderDTO } from 'src/common/dto/base-header.dto';
import { IncomeService } from './income.service';
export declare class IncomeController {
    private readonly incomeService;
    constructor(incomeService: IncomeService);
    getIncomes(headers: HeaderDTO): Promise<import("../interfaces").IncomeRO[]>;
}
