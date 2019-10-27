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
const rp = require("request-promise-native");
const common_1 = require("@nestjs/common");
const iban_entity_1 = require("../entities/iban.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const company_entity_1 = require("../entities/company.entity");
let IbansService = class IbansService {
    constructor(ibanRepository, companyRepository) {
        this.ibanRepository = ibanRepository;
        this.companyRepository = companyRepository;
    }
    snakeToCamel(obj) {
        const data = {};
        Object.keys(obj).forEach(k => {
            const key = k.replace(/([-_][a-z])/ig, ($1) => {
                return $1.toUpperCase()
                    .replace('-', '')
                    .replace('_', '');
            });
            data[key] = obj[k];
        });
        return data;
    }
    createIban(data, invoice, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newIban = data;
            const [itemBic] = newIban.bicCandidates;
            newIban.bic = itemBic.bic;
            newIban.readerCompany = invoice.companyReceiver;
            newIban.company = invoice.companyEmitter || null;
            const iban = this.ibanRepository.create(newIban);
            iban.jsonIbanBic = data;
            delete iban.jsonIbanBic.iban;
            delete iban.jsonIbanBic.readerCompany;
            delete iban.jsonIbanBic.company;
            iban.createdBy = (user) ? user : invoice.importedBy;
            yield this.ibanRepository.save(iban);
            return iban;
        });
    }
    createIbanBankAccount(data, user, company) {
        return __awaiter(this, void 0, void 0, function* () {
            const newIban = data;
            const [itemBic] = newIban.bicCandidates;
            newIban.bic = itemBic.bic;
            newIban.readerCompany = (company) ? company : user.currentCompany || null;
            newIban.company = (company) ? company : user.currentCompany || null;
            const iban = this.ibanRepository.create(newIban);
            iban.jsonIbanBic = data;
            delete iban.jsonIbanBic.iban;
            delete iban.jsonIbanBic.readerCompany;
            delete iban.jsonIbanBic.company;
            iban.createdBy = user || null;
            yield this.ibanRepository.save(iban);
            return iban;
        });
    }
    getApiValidateIban(iban) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield rp({
                    uri: `${process.env.IBAN_API_URL}/${process.env.IBAN_API_VALIDATION_PATH}/${iban}`,
                    json: true,
                    method: 'POST',
                    headers: {
                        'Authorization': 'Basic ' + Buffer.from(process.env.IBAN_API_USERNAME + ':' + process.env.IBAN_API_PASSWORD).toString('base64'),
                        'Content-Type': 'application/json',
                    },
                });
                return this.snakeToCamel(res);
            }
            catch (err) {
                throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
            }
        });
    }
    checkIban(iban) {
        return __awaiter(this, void 0, void 0, function* () {
            let status = iban_entity_1.IbanStatus.PASSED;
            let bic = '';
            const res = yield this.getApiValidateIban(iban);
            if (res.result === iban_entity_1.IbanStatus.FAILED) {
                status = iban_entity_1.IbanStatus.FAILED;
            }
            else if (res.ibanListed === iban_entity_1.IbanStatus.BLACKLIST) {
                status = iban_entity_1.IbanStatus.BLACKLIST;
            }
            else if (res.ibanListed === iban_entity_1.IbanStatus.FAKE) {
                status = iban_entity_1.IbanStatus.FAKE;
            }
            if (res.bicCandidates.length > 0) {
                bic = res.bicCandidates[0].bic;
            }
            return {
                name: res.bank,
                iban,
                bic,
                status,
            };
        });
    }
    findOneByIbanAndCompany(iban, company) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.ibanRepository.findOne({ iban, company });
        });
    }
    findByCompany(company) {
        return __awaiter(this, void 0, void 0, function* () {
            const [ibans, total] = yield this.ibanRepository.findAndCount({
                company,
            });
            return {
                total,
                rows: ibans,
            };
        });
    }
    findByCompanySiren(siren) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield this.companyRepository.findOne({ siren });
            const [ibans, total] = yield this.ibanRepository.findAndCount({ company });
            return {
                total,
                rows: ibans,
            };
        });
    }
};
IbansService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(iban_entity_1.Iban)),
    __param(1, typeorm_1.InjectRepository(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], IbansService);
exports.IbansService = IbansService;
//# sourceMappingURL=ibans.service.js.map