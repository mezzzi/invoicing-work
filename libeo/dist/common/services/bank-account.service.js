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
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bank_account_entity_1 = require("../entities/bank-account.entity");
const typeorm_2 = require("typeorm");
const ibans_service_1 = require("./ibans.service");
const mandate_entity_1 = require("../entities/mandate.entity");
let BankAccountService = class BankAccountService {
    constructor(bankAccountRepository, mandateRepository, ibansService) {
        this.bankAccountRepository = bankAccountRepository;
        this.mandateRepository = mandateRepository;
        this.ibansService = ibansService;
    }
    createOrUpdateBankAccount(company, user, data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!company) {
                throw new common_1.HttpException('api.error.company.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            let bankAccount = null;
            if (id) {
                bankAccount = yield this.bankAccountRepository.findOne({ where: { id }, relations: ['company', 'iban', 'mandates'] });
                if (!bankAccount) {
                    throw new common_1.HttpException('api.error.bank_account.not_found', common_1.HttpStatus.NOT_FOUND);
                }
                bankAccount.label = data.label;
                return bankAccount.save();
            }
            let defaultBankAccount = false;
            const nbBankAccount = yield this.bankAccountRepository.count({ company, default: true });
            if (nbBankAccount === 0) {
                defaultBankAccount = true;
            }
            bankAccount = this.bankAccountRepository.create({ label: data.label, company, default: defaultBankAccount });
            if (data.iban) {
                const alreadyIban = yield this.ibansService.findOneByIbanAndCompany(data.iban, company);
                bankAccount.iban = alreadyIban;
                if (!alreadyIban) {
                    try {
                        const res = yield this.ibansService.getApiValidateIban(data.iban);
                        res.iban = data.iban;
                        bankAccount.iban = yield this.ibansService.createIbanBankAccount(res, user, (!user) ? company : null);
                    }
                    catch (err) {
                        const logger = new common_1.Logger();
                        logger.error(err.message);
                        throw new common_1.HttpException('api.error.iban.check', err.statusCode);
                    }
                }
            }
            return this.bankAccountRepository.save(bankAccount);
        });
    }
    getBankAccounts(company) {
        return __awaiter(this, void 0, void 0, function* () {
            const [bankAccounts, total] = yield this.bankAccountRepository.findAndCount({ where: { company }, relations: ['company', 'iban', 'mandates'] });
            return {
                total,
                rows: bankAccounts,
            };
        });
    }
    getBankAccount(company, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const bankAccount = yield this.bankAccountRepository.findOne({ where: { id, company }, relations: ['company', 'iban', 'mandates'] });
            if (!bankAccount) {
                throw new common_1.HttpException('api.error.bank_account.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            return bankAccount;
        });
    }
    changeDefaultBankAccount(company, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const bankAccount = yield this.bankAccountRepository.findOne({ where: { id, company }, relations: ['company', 'iban', 'mandates'] });
            if (!bankAccount) {
                throw new common_1.HttpException('api.error.bank_account.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            const result = [bankAccount];
            const defaultBankAccount = yield this.bankAccountRepository.findOne({ where: { company, default: true, id: typeorm_2.Not(bankAccount.id) }, relations: ['company', 'iban', 'mandates'] });
            if (defaultBankAccount) {
                defaultBankAccount.default = false;
                yield defaultBankAccount.save();
                result.push(defaultBankAccount);
            }
            bankAccount.default = true;
            yield bankAccount.save();
            return result;
        });
    }
    removeBankAccount(company, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!company) {
                throw new common_1.HttpException('api.error.company.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            const bankAccount = yield this.bankAccountRepository.findOne({ where: { id, company, enabled: true }, relations: ['company', 'iban', 'mandates'] });
            if (!bankAccount) {
                throw new common_1.HttpException('api.error.bank_account.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            const nbdefaultBankAccounts = yield this.bankAccountRepository.count({ id: typeorm_2.Not(bankAccount.id), company, default: false });
            if (bankAccount.default === true && nbdefaultBankAccounts > 0) {
                throw new common_1.HttpException('api.error.bank_account.default', common_1.HttpStatus.BAD_REQUEST);
            }
            const nbActiveMandates = yield this.mandateRepository.count({ bankAccount, status: mandate_entity_1.MandateStatus.SIGNED });
            if (nbActiveMandates > 0) {
                throw new common_1.HttpException('api.error.bank_account.active_mandate', common_1.HttpStatus.BAD_REQUEST);
            }
            bankAccount.enabled = false;
            yield bankAccount.save();
            return bankAccount;
        });
    }
};
BankAccountService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(bank_account_entity_1.BankAccount)),
    __param(1, typeorm_1.InjectRepository(mandate_entity_1.Mandate)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        ibans_service_1.IbansService])
], BankAccountService);
exports.BankAccountService = BankAccountService;
//# sourceMappingURL=bank-account.service.js.map