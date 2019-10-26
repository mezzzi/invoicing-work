import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../common/services/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../common/entities/user.entity';
export declare class AuthService {
    private readonly jwtService;
    private readonly usersService;
    constructor(jwtService: JwtService, usersService: UsersService);
    createToken(email: string): string;
    validateUser(payload: JwtPayload): Promise<User>;
}
