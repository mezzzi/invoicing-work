"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const users_service_1 = require("../common/services/users.service");
const signup_dto_1 = require("./interfaces/signup.dto");
const signin_dto_1 = require("./interfaces/signin.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const reset_password_dto_1 = require("./interfaces/reset-password.dto");
const email_service_1 = require("../notification/email.service");
const token_generator_service_1 = require("../common/services/token-generator.service");
const support_service_1 = require("../notification/support.service");
let AuthResolvers = class AuthResolvers {
    constructor(authService, usersService, emailService, supportService, tokenGeneratorService) {
        this.authService = authService;
        this.usersService = usersService;
        this.emailService = emailService;
        this.supportService = supportService;
        this.tokenGeneratorService = tokenGeneratorService;
    }
    signup(ctx, input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (input.password !== input.passwordConfirmation) {
                throw new common_1.HttpException('api.error.signup.password_mismatch', common_1.HttpStatus.BAD_REQUEST);
            }
            if (input.cgu !== true) {
                throw new common_1.HttpException('api.error.signup.cgu', common_1.HttpStatus.BAD_REQUEST);
            }
            let user = yield this.usersService.findOneByEmail(input.email);
            if (user) {
                throw new common_1.HttpException('api.error.signup_email_exist', common_1.HttpStatus.BAD_REQUEST);
            }
            delete input.cgu;
            user = yield this.usersService.createUser(input);
            const baseUrl = (ctx.req.headers && ctx.req.headers.origin) ? ctx.req.headers.origin : null;
            this.usersService.confirmationToken(user, baseUrl);
            yield this.supportService.createTicketNewUser(user);
            return user;
        });
    }
    signin(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersService.findOneByEmail(input.email);
            if (!user) {
                throw new common_1.HttpException('api.error.signin', common_1.HttpStatus.BAD_REQUEST);
            }
            if (user.enabled === false) {
                throw new common_1.HttpException('api.error.user.disabled', common_1.HttpStatus.UNAUTHORIZED);
            }
            if (user.blocked === true) {
                throw new common_1.HttpException('api.error.user.blocked', common_1.HttpStatus.UNAUTHORIZED);
            }
            if (!(yield this.usersService.compareHash(input.password, user.password))) {
                throw new common_1.HttpException('api.error.signin', common_1.HttpStatus.BAD_REQUEST);
            }
            user.lastLogin = new Date();
            user.token = this.authService.createToken(user.email);
            return user.save();
        });
    }
    sendPasswordResetEmail(ctx, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersService.findOneByEmail(input.email);
            if (user) {
                user.passwordConfirmationToken = this.tokenGeneratorService.generateToken();
                yield user.save();
                const baseUrl = (ctx.req.headers && ctx.req.headers.origin) ? ctx.req.headers.origin : `://${process.env.DOMAIN}`;
                const resetPasswordEmail = {
                    To: [{
                            Email: user.email,
                            Name: user.fullName
                        }],
                    TemplateID: 844925,
                    Variables: {
                        fullName: user.fullName,
                        resetPasswordLink: `${baseUrl}/reset-password/${user.passwordConfirmationToken}`,
                    },
                    Subject: 'Réinitialisez votre mot de passe'
                };
                yield this.emailService.send([resetPasswordEmail]);
            }
            return { status: true };
        });
    }
    resetPassword(input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (input.password !== input.confirmPassword) {
                throw new common_1.BadRequestException('api.error.user.password_must_match');
            }
            const user = yield this.usersService.findOneByPasswordConfirmationToken(input.confirmationToken);
            if (!user) {
                throw new common_1.BadRequestException('api.error.user.wrong_confirm_token');
            }
            yield this.usersService.updatePassword(user, input.password);
            return true;
        });
    }
    logout(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = ctx.req.user;
            user.token = null;
            yield user.save();
            return true;
        });
    }
};
__decorate([
    graphql_1.Mutation(),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, signup_dto_1.SignUpPayload]),
    __metadata("design:returntype", Promise)
], AuthResolvers.prototype, "signup", null);
__decorate([
    graphql_1.Mutation(),
    __param(0, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signin_dto_1.SignInPayload]),
    __metadata("design:returntype", Promise)
], AuthResolvers.prototype, "signin", null);
__decorate([
    graphql_1.Mutation(),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, reset_password_dto_1.SendPasswordResetEmail]),
    __metadata("design:returntype", Promise)
], AuthResolvers.prototype, "sendPasswordResetEmail", null);
__decorate([
    graphql_1.Mutation(),
    __param(0, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordPayload]),
    __metadata("design:returntype", Promise)
], AuthResolvers.prototype, "resetPassword", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthResolvers.prototype, "logout", null);
AuthResolvers = __decorate([
    graphql_1.Resolver('User'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService,
        email_service_1.EmailService,
        support_service_1.SupportService,
        token_generator_service_1.TokenGeneratorService])
], AuthResolvers);
exports.AuthResolvers = AuthResolvers;
//# sourceMappingURL=auth.resolvers.js.map