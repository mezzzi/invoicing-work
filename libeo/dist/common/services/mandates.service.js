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
const uuid = require("uuid");
const moment = require("moment");
const common_1 = require("@nestjs/common");
const mandate_entity_1 = require("../entities/mandate.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const treezor_service_1 = require("../../payment/treezor.service");
const mandate_interface_1 = require("../../payment/interfaces/treezor/mandate.interface");
const bank_account_entity_1 = require("../entities/bank-account.entity");
const address_entity_1 = require("../entities/address.entity");
const mandate_repository_1 = require("../repositories/mandate.repository");
const email_service_1 = require("../../notification/email.service");
let MandatesService = class MandatesService {
    constructor(mandateRepository, bankAccountRepository, addressRepository, emailService, treezorService) {
        this.mandateRepository = mandateRepository;
        this.bankAccountRepository = bankAccountRepository;
        this.addressRepository = addressRepository;
        this.emailService = emailService;
        this.treezorService = treezorService;
    }
    createMandate(user, bankAccountId, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = user.currentCompany;
            if (!company) {
                throw new common_1.HttpException('api.error.company.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            const bankAccount = yield this.bankAccountRepository.findOne({ where: { id: bankAccountId }, relations: ['iban'] });
            if (!bankAccount) {
                throw new common_1.HttpException('api.error.bank_account.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            let defaultAddress = null;
            if (company.addresses && company.addresses.length > 0) {
                defaultAddress = company.addresses[0];
            }
            else {
                defaultAddress = yield this.addressRepository.findOne({ where: { company }, order: { createdAt: 'DESC' } });
            }
            let debtorAddress = '';
            if (defaultAddress) {
                if (defaultAddress.address1) {
                    debtorAddress = defaultAddress.address1;
                }
                if (defaultAddress.address2) {
                    debtorAddress += ` / ${defaultAddress.address2}`;
                }
            }
            let treezorMandate = null;
            const params = {
                sddType: mandate_interface_1.MandateSddType.CORE,
                isPaper: true,
                debtorName: company.name || company.brandName || '',
                debtorAddress,
                debtorCity: (defaultAddress) ? defaultAddress.city : '',
                debtorZipCode: (defaultAddress) ? defaultAddress.zipcode.toString() : '',
                debtorCountry: (defaultAddress) ? defaultAddress.country : '',
                debtorIban: (bankAccount.iban) ? bankAccount.iban.iban : '',
                debtorBic: (bankAccount.iban) ? bankAccount.iban.bic : '',
                sequenceType: mandate_interface_1.MandateSequenceType.RECURRENT,
                createdIp: ip,
                signatureDate: moment().format('YYYY-MM-DD'),
            };
            try {
                treezorMandate = yield this.treezorService.createMandate(params);
            }
            catch (err) {
                throw new common_1.HttpException(err.message, err.statusCode);
            }
            const mandate = this.mandateRepository.create({
                bankAccount,
                treezorMandateId: treezorMandate.mandateId.toString(),
                rum: treezorMandate.uniqueMandateReference,
                status: mandate_entity_1.MandateStatus.VALIDATED,
                signatory: user,
                signatoryIp: ip,
                signaturedAt: new Date()
            });
            yield mandate.save();
            return mandate;
        });
    }
    signedMandate(user, mandateId, code) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user.currentCompany) {
                throw new common_1.HttpException('api.error.company.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            const mandate = yield this.mandateRepository.findOneWithRelationships(mandateId, user.currentCompany);
            if (!mandate) {
                throw new common_1.HttpException('api.error.mandate.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            if (mandate.validationCode !== code) {
                throw new common_1.HttpException('api.error.mandate.invalid_code', common_1.HttpStatus.BAD_REQUEST);
            }
            mandate.status = mandate_entity_1.MandateStatus.SIGNED;
            yield mandate.save();
            const message = {
                From: {
                    Email: 'lucas@libeo.io',
                    Name: 'Service Client Libeo',
                },
                To: [{
                        Email: user.email,
                        Name: user.fullName,
                    }],
                TemplateID: 823915,
                TemplateLanguage: true,
                Subject: 'Confirmation : mandat de prélèvement SEPA activé',
                Variables: {
                    fullName: user.fullName,
                    bankAccountLabel: mandate.bankAccount.label,
                    mandateRum: mandate.rum,
                },
            };
            yield this.emailService.send([message]);
            return mandate;
        });
    }
    getMandate(company, mandateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const mandate = yield this.mandateRepository.findOneWithRelationships(mandateId, company);
            if (!mandate) {
                throw new common_1.HttpException('api.error.mandate.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            return mandate;
        });
    }
    generateCodeMandate(user, mandateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const mandate = yield this.mandateRepository.findOneWithRelationships(mandateId, user.currentCompany);
            if (!mandate) {
                throw new common_1.HttpException('api.error.mandate.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            if (mandate.status !== mandate_entity_1.MandateStatus.VALIDATED) {
                throw new common_1.HttpException('api.error.mandate.invalid_status', common_1.HttpStatus.BAD_REQUEST);
            }
            const code = uuid.v4().replace('-', '').slice(0, 6);
            mandate.validationCode = code;
            yield mandate.save();
            const message = {
                To: [{
                        Email: user.email,
                        Name: user.fullName,
                    }],
                TemplateID: 824526,
                Subject: 'Signez le mandat de prélèvement SEPA',
                Variables: {
                    fullName: user.fullName,
                    bankAccountLabel: mandate.bankAccount.label,
                    mandateSignatureCode: code,
                },
            };
            yield this.emailService.send([message]);
            return mandate;
        });
    }
    removeMandate(company, mandateId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!company) {
                throw new common_1.HttpException('api.error.company.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            const mandate = yield this.mandateRepository.findOneWithRelationships(mandateId, company);
            if (!mandate) {
                throw new common_1.HttpException('api.error.mandate.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            if (mandate.status === mandate_entity_1.MandateStatus.CANCELED) {
                throw new common_1.HttpException('api.error.mandate.invalid_status', common_1.HttpStatus.NOT_FOUND);
            }
            if (mandate.status !== mandate_entity_1.MandateStatus.SIGNED) {
                throw new common_1.HttpException('api.error.mandate.invalid_status', common_1.HttpStatus.BAD_REQUEST);
            }
            try {
                yield this.treezorService.deleteMandate({ mandateId: mandate.treezorMandateId, origin: mandate_interface_1.MandateOrigin.CREDITOR });
            }
            catch (err) {
                throw new common_1.HttpException(err.message, err.statusCode);
            }
            mandate.status = mandate_entity_1.MandateStatus.CANCELED;
            yield mandate.save();
            return mandate;
        });
    }
};
MandatesService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(mandate_entity_1.Mandate)),
    __param(1, typeorm_1.InjectRepository(bank_account_entity_1.BankAccount)),
    __param(2, typeorm_1.InjectRepository(address_entity_1.Address)),
    __metadata("design:paramtypes", [mandate_repository_1.MandateRepository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService,
        treezor_service_1.TreezorService])
], MandatesService);
exports.MandatesService = MandatesService;
//# sourceMappingURL=mandates.service.js.map