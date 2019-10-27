import { User } from '../entities/user.entity';
import { List } from '../interfaces/common.interface';
import { CompaniesService } from '../services/companies.service';
import { UsersService } from '../services/users.service';
import { UpdateUserDto } from '../dto/users.dto';
export declare class UsersResolvers {
    private readonly companiesService;
    private readonly usersService;
    constructor(companiesService: CompaniesService, usersService: UsersService);
    refreshConfirmationTokenUser(ctx: any, email: string): Promise<User>;
    activateUser(confirmationToken: string): Promise<boolean>;
    updateUser(ctx: any, data: UpdateUserDto): Promise<User>;
    me(ctx: any): User;
    companies(user: User): Promise<List>;
}
