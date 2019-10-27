import { AuthService } from './auth.service';
import { UsersService } from '../common/services/users.service';
import { SignUpPayload } from './interfaces/signup.dto';
import { SignInPayload } from './interfaces/signin.dto';
import { User } from '../common/entities/user.entity';
import { ResetPasswordPayload, PasswordReset, SendPasswordResetEmail } from './interfaces/reset-password.dto';
import { EmailService } from '../notification/email.service';
import { TokenGeneratorService } from '../common/services/token-generator.service';
import { SupportService } from '../notification/support.service';
export declare class AuthResolvers {
    private readonly authService;
    private readonly usersService;
    private readonly emailService;
    private readonly supportService;
    private readonly tokenGeneratorService;
    constructor(authService: AuthService, usersService: UsersService, emailService: EmailService, supportService: SupportService, tokenGeneratorService: TokenGeneratorService);
    signup(ctx: any, input: SignUpPayload): Promise<User>;
    signin(input: SignInPayload): Promise<User>;
    sendPasswordResetEmail(ctx: any, input: SendPasswordResetEmail): Promise<PasswordReset>;
    resetPassword(input: ResetPasswordPayload): Promise<boolean>;
    logout(ctx: any): Promise<boolean>;
}
