import { Base } from './base.entity';
import { Company } from './company.entity';
export declare class Export extends Base {
    company: Company;
    fileLink: string;
    enabled: boolean;
}
