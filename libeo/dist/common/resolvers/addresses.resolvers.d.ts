import { AddressesService } from '../services/addresses.service';
import { Address } from '../entities/address.entity';
import { CreateAddressDto } from '../dto/addresses.dto';
export declare class AddressesResolvers {
    private readonly addressesService;
    constructor(addressesService: AddressesService);
    createOrUpdateAddress(ctx: any, input: CreateAddressDto): Promise<Address>;
    removeAddress(ctx: any, id: string): Promise<Address>;
}
