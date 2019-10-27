import { Payin } from '../entities/payin.entity';
import { Repository } from 'typeorm';
import { CreatePayinPayload } from '../interfaces/payin.interface';
import { ITreezorPayin } from '../../payment/interfaces/treezor/payin.interface';
export declare class PayinsService {
    private readonly payinRepository;
    constructor(payinRepository: Repository<Payin>);
    createPayin(data: CreatePayinPayload): Promise<Payin>;
    hydratePayinWithTreezor(payin: Payin, treezorPayin: ITreezorPayin): Promise<void>;
}
