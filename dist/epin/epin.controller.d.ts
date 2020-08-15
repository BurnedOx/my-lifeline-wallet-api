import { EpinService } from './epin.service';
import { HeaderDTO } from 'src/common/dto/base-header.dto';
export declare class EpinController {
    private readonly epinService;
    constructor(epinService: EpinService);
    getAll(status?: 'used' | 'unused'): Promise<import("../interfaces").EpinRO[]>;
    getEpin(headers: HeaderDTO): Promise<import("../interfaces").EpinRO>;
    generate(): Promise<import("../interfaces").EpinRO>;
}
