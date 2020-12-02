import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { IncomeService } from "src/income/income.service";

@Processor('account')
export class AccountProcessor {
    constructor(private readonly incomeService: IncomeService) {}

    @Process('distribution')
    generateIncome(job: Job<{ userId: string }>) {
        return this.incomeService.generateIncomes(job.data.userId);
    }
}