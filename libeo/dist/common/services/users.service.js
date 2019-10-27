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
const bcrypt = require("bcryptjs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const company_entity_1 = require("../entities/company.entity");
const token_generator_service_1 = require("./token-generator.service");
const email_service_1 = require("../../notification/email.service");
let UsersService = class UsersService {
    constructor(userRepository, companyRepository, tokenGeneratorService, emailService) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.tokenGeneratorService = tokenGeneratorService;
        this.emailService = emailService;
        this.saltRounds = 10;
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new user_entity_1.User();
            user.firstname = data.firstname;
            user.lastname = data.lastname;
            user.email = data.email;
            user.password = data.password;
            user.enabled = true;
            user.password = yield this.getHash(data.password);
            yield user.save();
            return user;
        });
    }
    findMyCompanyByUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.companyRepository.findOne({ id: user.currentCompany.id });
        });
    }
    findOneByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.findOne({ email: email.toLocaleLowerCase() });
        });
    }
    findOneByPasswordConfirmationToken(passwordConfirmationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.findOne({ passwordConfirmationToken });
        });
    }
    updatePassword(user, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                user.password = yield this.getHash(newPassword);
                user.passwordConfirmationToken = this.tokenGeneratorService.generateToken();
                yield user.save();
            }
            catch (err) {
                throw new Error(err);
            }
        });
    }
    getHash(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt.hash(password, this.saltRounds);
        });
    }
    compareHash(password, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt.compare(password, hash);
        });
    }
    confirmationToken(user, baseUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            user.enabled = false;
            user.emailConfirmationToken = this.tokenGeneratorService.generateToken();
            yield user.save();
            const message = {
                To: [{
                        Email: user.email,
                        Name: user.fullName,
                    }],
                TemplateID: 705763,
                Subject: 'Activez votre compte Libeo',
                Variables: {
                    fullName: user.fullName,
                    emailValidationLink: `${baseUrl}/login/${user.emailConfirmationToken}?email=${user.email}`
                },
            };
            yield this.emailService.send([message]);
            return user;
        });
    }
    activateUser(confirmationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ enabled: false, emailConfirmationToken: confirmationToken });
            if (!user) {
                throw new common_1.HttpException('api.error.user.invalid_confirmation_token', common_1.HttpStatus.BAD_REQUEST);
            }
            user.enabled = true;
            user.emailConfirmationToken = null;
            yield user.save();
            return true;
        });
    }
    updateUser(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.password) {
                data.password = yield this.getHash(data.password);
            }
            user = Object.assign(user, data);
            yield user.save();
            return user;
        });
    }
};
UsersService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(user_entity_1.User)),
    __param(1, typeorm_1.InjectRepository(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        token_generator_service_1.TokenGeneratorService,
        email_service_1.EmailService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map