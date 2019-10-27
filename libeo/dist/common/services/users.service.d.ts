import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Company } from '../entities/company.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/users.dto';
import { TokenGeneratorService } from './token-generator.service';
import { EmailService } from '../../notification/email.service';
export declare class UsersService {
    private readonly userRepository;
    private readonly companyRepository;
    private readonly tokenGeneratorService;
    private readonly emailService;
    private readonly saltRounds;
    constructor(userRepository: Repository<User>, companyRepository: Repository<Company>, tokenGeneratorService: TokenGeneratorService, emailService: EmailService);
    createUser(data: CreateUserDto): Promise<User>;
    findMyCompanyByUser(user: User): Promise<Company>;
    findOneByEmail(email: string): Promise<User>;
    findOneByPasswordConfirmationToken(passwordConfirmationToken: string): Promise<User>;
    updatePassword(user: User, newPassword: string): Promise<void>;
    getHash(password: string | undefined): Promise<string>;
    compareHash(password: string | undefined, hash: string | undefined): Promise<boolean>;
    confirmationToken(user: User, baseUrl: string): Promise<User>;
    activateUser(confirmationToken: string): Promise<boolean>;
    updateUser(user: User, data: UpdateUserDto): Promise<User>;
}
