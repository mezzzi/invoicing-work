import { Company } from './company.entity';
import { Base } from './base.entity';
import { Iban } from './iban.entity';
import { Mandate } from './mandate.entity';
export declare class BankAccount extends Base {
    label: string;
    default: boolean;
    enabled: boolean;
    company: Company;
    iban: Iban;
    mandates: Mandate[];
}
