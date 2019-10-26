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
const fs = require("fs");
const path = require("path");
const shortid = require("shortid");
const Zendesk = require("zendesk-node-api");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const company_entity_1 = require("../entities/company.entity");
const siren_service_1 = require("../../siren/siren.service");
const partner_entity_1 = require("../entities/partner.entity");
const email_entity_1 = require("../entities/email.entity");
const contact_entity_1 = require("../entities/contact.entity");
const treezor_service_1 = require("../../payment/treezor.service");
const constants_1 = require("../../constants");
const accounting_preference_entity_1 = require("../entities/accounting-preference.entity");
let CompaniesService = class CompaniesService {
    constructor(companyRepository, partnerRepository, contactRepository, emailRepository, accountingPreferenceRepository, sirenService) {
        this.companyRepository = companyRepository;
        this.partnerRepository = partnerRepository;
        this.contactRepository = contactRepository;
        this.emailRepository = emailRepository;
        this.accountingPreferenceRepository = accountingPreferenceRepository;
        this.sirenService = sirenService;
    }
    createAccountingPreferences(company) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!company.claimer) {
                return;
            }
            yield this.accountingPreferenceRepository.save([
                {
                    enabled: true,
                    order: 1,
                    company,
                    key: 'Journal de banque',
                    value: 'BAN',
                    description: null,
                    type: accounting_preference_entity_1.AccountingPreferenceType.LEDGER_BANK
                },
                {
                    enabled: true,
                    order: 0,
                    company,
                    key: 'Journal d\'achat',
                    value: 'ACH',
                    description: null,
                    type: accounting_preference_entity_1.AccountingPreferenceType.LEDGER_PURCHASE
                },
                {
                    enabled: true,
                    order: 2,
                    company,
                    key: 'Journal de vente',
                    value: 'VEN',
                    description: null,
                    type: accounting_preference_entity_1.AccountingPreferenceType.LEDGER_SALES
                },
                {
                    enabled: true,
                    order: 0,
                    company,
                    key: 'Compte TVA déductible',
                    value: '445660',
                    description: null,
                    type: accounting_preference_entity_1.AccountingPreferenceType.VAT_ACCOUNT
                },
                {
                    enabled: true,
                    order: 0,
                    company,
                    key: 'Compte banque Libeo',
                    value: '512000',
                    description: null,
                    type: accounting_preference_entity_1.AccountingPreferenceType.BANK_ACCOUNT_TREEZOR
                }
            ]);
        });
    }
    createCompanyShell(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = this.companyRepository.create();
            yield this.companyRepository.save(company);
            user.currentCompany = company;
            yield user.save();
            return company;
        });
    }
    createOrUpdateCompany(user, data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data) {
                return this.createCompanyShell(user);
            }
            if (id) {
                let myCompany = yield this.companyRepository.findOne({ id });
                if (!myCompany) {
                    throw new common_1.HttpException('api.error.company.not_found', common_1.HttpStatus.NOT_FOUND);
                }
                myCompany = Object.assign(myCompany, data);
                yield this.companyRepository.save(myCompany);
                return myCompany;
            }
            let company = yield this.findOneBySiren(data.siren);
            if (company) {
                throw new common_1.HttpException('api.error.company.already', common_1.HttpStatus.BAD_REQUEST);
            }
            if (data && data.incorporationAt) {
                data.incorporationAt = new Date(+data.incorporationAt);
            }
            const currentCompany = user.currentCompany;
            if (!currentCompany) {
                company = yield this.companyRepository.create(data);
                company.claimer = user;
                yield company.save();
                user.currentCompany = company;
                yield user.save();
            }
            else if (currentCompany.siren === null) {
                company = Object.assign(currentCompany, data);
                company.claimer = user;
                yield company.save();
            }
            else {
                company = yield this.companyRepository.create(data);
                company.claimer = user;
                yield company.save();
            }
            const email = new email_entity_1.Email();
            email.email = user.email;
            email.visibleOnlyCompany = company.id;
            yield this.emailRepository.save(email);
            const contact = new contact_entity_1.Contact();
            contact.firstname = user.firstname;
            contact.lastname = user.lastname;
            contact.visibleOnlyCompany = company.id;
            contact.emails = [email];
            contact.user = user;
            contact.company = company;
            yield this.contactRepository.save(contact);
            yield this.createAccountingPreferences(company);
            return company;
        });
    }
    searchCompanies(query, orderBy, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sirenService.search(query, orderBy, limit, offset);
        });
    }
    findOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.companyRepository.findOne({ id });
        });
    }
    findOneBySiren(siren) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.companyRepository.findOne({ siren });
        });
    }
    findOneBySiret(siret) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.companyRepository.findOne({ siret });
        });
    }
    getCurrentCompanyByUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user.currentCompany) {
                return this.createCompanyShell(user);
            }
            return user.currentCompany;
        });
    }
    getStatus(user, company) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user) {
                return null;
            }
            if (user.currentCompany && user.currentCompany.siren === company.siren) {
                return company_entity_1.CompanyStatus.SELF;
            }
            const companyPartner = yield this.findOneBySiren(company.siren);
            const nbPartners = yield this.partnerRepository.count({ companyInitiator: user.currentCompany, companyPartner });
            if (nbPartners > 0) {
                return company_entity_1.CompanyStatus.ALREADY;
            }
            if (companyPartner) {
                return company_entity_1.CompanyStatus.EXIST;
            }
            return company_entity_1.CompanyStatus.UNKNOWN;
        });
    }
    findByUser(user, orderBy, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            const contacts = yield this.contactRepository.find({ user: { id: user.id } });
            if (contacts.length === 0) {
                return {
                    total: 0,
                    rows: [],
                };
            }
            const companyIds = contacts.map(contact => {
                if (contact.company) {
                    return contact.company.id;
                }
                return null;
            });
            const [companies, total] = yield this.companyRepository.findAndCount({
                where: { id: typeorm_2.In(companyIds) },
                take: limit,
                skip: offset
            });
            return {
                total,
                rows: companies,
            };
        });
    }
    getContract(company) {
        return __awaiter(this, void 0, void 0, function* () {
            const rootDirectory = path.resolve(`${__dirname}/../../../public/static`);
            const destinationDirectory = path.resolve(`${rootDirectory}/companies/${company.id}`);
            if (!fs.existsSync(destinationDirectory)) {
                fs.mkdirSync(destinationDirectory, { recursive: true });
            }
            try {
                yield fs.copyFileSync(`${rootDirectory}/contract/contract.pdf`, `${destinationDirectory}/contract.pdf`);
            }
            catch (err) {
                throw new common_1.HttpException('api.error.company.contract', common_1.HttpStatus.BAD_REQUEST);
            }
            return `companies/${company.id}/contract.pdf`;
        });
    }
    signContract(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let company = user.currentCompany;
            if (!company) {
                throw new common_1.HttpException('api.error.company.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            company.signature = {
                userId: user.id,
                signedAt: new Date(),
            };
            yield company.save();
            const treezor = new treezor_service_1.TreezorService({
                baseUrl: process.env.TREEZOR_API_URL,
                token: process.env.TREEZOR_TOKEN,
                secretKey: process.env.TREEZOR_SECRET_KEY,
            });
            const { users } = yield treezor.getBeneficiaries({
                userTypeId: 1,
                userStatus: 'VALIDATED',
                parentUserId: company.treezorUserId,
            });
            let sendKyc = true;
            users.forEach((physicalUser) => {
                if (physicalUser.country === 'US' || physicalUser.birthCountry === 'US' || physicalUser.nationality === 'US') {
                    sendKyc = false;
                }
            });
            if (!sendKyc) {
                company = yield this.companyRepository.findOne({ where: { id: company.id }, relations: ['claimer'] });
                const zendesk = new Zendesk({
                    url: process.env.ZENDESK_API_URL,
                    email: process.env.ZENDESK_API_EMAIL,
                    token: process.env.ZENDESK_API_TOKEN,
                });
                zendesk.tickets.create({
                    type: 'incident',
                    priority: 'hight',
                    requester: { name: company.claimer.fullName, email: company.claimer.email },
                    subject: 'KYC FATCA',
                    comment: { body: `Le KYC necessite des documents complémentaires pour l'entreprise ${company.name}` },
                    custom_fields: [constants_1.environmentZendesk],
                });
            }
            return true;
        });
    }
    createBeneficiary(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = user.currentCompany;
            if (!company) {
                throw new common_1.HttpException('api.error.company.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            const { documents } = data;
            let beneficiary = null;
            const treezor = new treezor_service_1.TreezorService({
                baseUrl: process.env.TREEZOR_API_URL,
                token: process.env.TREEZOR_TOKEN,
                secretKey: process.env.TREEZOR_SECRET_KEY,
            });
            data.userTag = {};
            if (data.isCurrentUser) {
                data.userTag.userId = user.id;
            }
            if (data.isHosted) {
                data.userTag.isHosted = true;
            }
            data.userTag = JSON.stringify(data.userTag);
            delete data.isCurrentUser;
            delete data.isHosted;
            delete data.documents;
            const { taxResidence } = data;
            delete data.taxResidence;
            data.userTypeId = 1;
            data.parentUserId = company.treezorUserId;
            data.parentType = 'leader';
            if (!data.userId) {
                data.email = `payment.${shortid.generate()}@libeo.io`;
            }
            try {
                beneficiary = (data.userId) ? yield treezor.updateUser(data) : yield treezor.createUser(data);
            }
            catch (err) {
                throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_GATEWAY);
            }
            if (taxResidence) {
                data.taxResidence = yield this.createOrUpdateTaxResidence(beneficiary.userId, taxResidence, beneficiary.country);
            }
            if (!documents) {
                return beneficiary;
            }
            const promiseDocuments = documents.map(document => {
                document.userId = beneficiary.userId;
                return treezor.createDocument(document);
            });
            try {
                beneficiary.documents = yield Promise.all(promiseDocuments);
            }
            catch (err) {
                throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_GATEWAY);
            }
            return beneficiary;
        });
    }
    removeBeneficiary(company, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const treezor = new treezor_service_1.TreezorService({
                baseUrl: process.env.TREEZOR_API_URL,
                token: process.env.TREEZOR_TOKEN,
                secretKey: process.env.TREEZOR_SECRET_KEY,
                userId: company.treezorUserId,
            });
            try {
                return yield treezor.removeUser({ userId, origin: 'USER' });
            }
            catch (err) {
                throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_GATEWAY);
            }
        });
    }
    getTaxResidence(userId, country) {
        return __awaiter(this, void 0, void 0, function* () {
            const treezor = new treezor_service_1.TreezorService({
                baseUrl: process.env.TREEZOR_API_URL,
                token: process.env.TREEZOR_TOKEN,
                secretKey: process.env.TREEZOR_SECRET_KEY,
            });
            try {
                return yield treezor.getTaxResidence(userId, country);
            }
            catch (err) {
                throw new common_1.HttpException(err.message, err.statusCode);
            }
        });
    }
    createOrUpdateTaxResidence(userId, taxPayerId, country) {
        return __awaiter(this, void 0, void 0, function* () {
            let taxResidence = null;
            const treezor = new treezor_service_1.TreezorService({
                baseUrl: process.env.TREEZOR_API_URL,
                token: process.env.TREEZOR_TOKEN,
                secretKey: process.env.TREEZOR_SECRET_KEY,
            });
            try {
                taxResidence = yield treezor.getTaxResidence(userId, country);
            }
            catch (err) {
                throw new common_1.HttpException(err.message, err.statusCode);
            }
            if (!taxResidence) {
                try {
                    taxResidence = yield treezor.createTaxResidence({
                        country,
                        taxPayerId: (taxPayerId) ? taxPayerId : null,
                        userId,
                        liabilityWaiver: (!taxPayerId) ? true : false,
                    });
                }
                catch (err) {
                    throw new common_1.HttpException(err.message, err.statusCode);
                }
            }
            taxPayerId = (taxPayerId) ? taxPayerId : '';
            if (taxResidence && (taxResidence.taxPayerId !== taxPayerId || taxResidence.country !== country)) {
                try {
                    taxResidence = yield treezor.updateTaxResidence({
                        taxResidenceId: taxResidence.id,
                        country,
                        taxPayerId: (taxPayerId) ? taxPayerId : null,
                        userId,
                        liabilityWaiver: (!taxPayerId) ? true : false,
                    });
                }
                catch (err) {
                    throw new common_1.HttpException(err.message, err.statusCode);
                }
            }
            return taxResidence;
        });
    }
    removeDocument(documentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const treezor = new treezor_service_1.TreezorService({
                baseUrl: process.env.TREEZOR_API_URL,
                token: process.env.TREEZOR_TOKEN,
                secretKey: process.env.TREEZOR_SECRET_KEY,
            });
            try {
                return yield treezor.deleteDocument(documentId);
            }
            catch (err) {
                throw new common_1.HttpException(err.message, err.statusCode);
            }
        });
    }
    getRepresentatives(company) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!company || !company.siren) {
                return {
                    total: 0,
                    rows: [],
                };
            }
            let info = null;
            const treezor = new treezor_service_1.TreezorService({
                baseUrl: process.env.TREEZOR_API_URL,
                token: process.env.TREEZOR_TOKEN,
                secretKey: process.env.TREEZOR_SECRET_KEY,
            });
            try {
                const { businessinformations } = yield treezor.getBusinessInformations({
                    country: 'FR',
                    registrationNumber: company.siren,
                });
                if (businessinformations && businessinformations.length > 0) {
                    info = businessinformations[0];
                }
                else {
                    return {
                        total: 0,
                        rows: [],
                    };
                }
            }
            catch (err) {
                throw new common_1.HttpException(err.message, err.statusCode);
            }
            const users = info.users;
            return {
                total: users.length,
                rows: users,
            };
        });
    }
    getBeneficiaries(company, limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!company || !company.treezorUserId) {
                return {
                    total: 0,
                    rows: [],
                };
            }
            const treezor = new treezor_service_1.TreezorService({
                baseUrl: process.env.TREEZOR_API_URL,
                token: process.env.TREEZOR_TOKEN,
                secretKey: process.env.TREEZOR_SECRET_KEY,
                userId: company.treezorUserId,
            });
            try {
                const { users } = yield treezor.getBeneficiaries({
                    userTypeId: 1,
                    userStatus: 'VALIDATED',
                    parentUserId: company.treezorUserId,
                });
                return {
                    total: users.length,
                    rows: users,
                };
            }
            catch (err) {
                throw new common_1.HttpException(err.message, err.statusCode);
            }
        });
    }
    getDocuments(userId, limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const treezor = new treezor_service_1.TreezorService({
                baseUrl: process.env.TREEZOR_API_URL,
                token: process.env.TREEZOR_TOKEN,
                secretKey: process.env.TREEZOR_SECRET_KEY,
            });
            try {
                const { documents } = yield treezor.getDocuments({
                    userId,
                    pageCount: limit,
                    pageNumber: page,
                });
                return {
                    total: documents.length,
                    rows: documents,
                };
            }
            catch (err) {
                throw new common_1.HttpException(err.message, err.statusCode);
            }
        });
    }
    updateKycStatus(user, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = user.currentCompany;
            if (!company) {
                throw new common_1.HttpException('api.error.company.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            company.kycStatus = status;
            yield company.save();
            return company;
        });
    }
    updateKycStep(company, step) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!company) {
                throw new common_1.HttpException('api.error.company.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            company.kycStep = step;
            yield company.save();
            return company;
        });
    }
    getCompanyComplementaryInfos(siren) {
        return __awaiter(this, void 0, void 0, function* () {
            const treezor = new treezor_service_1.TreezorService({
                baseUrl: process.env.TREEZOR_API_URL,
                token: process.env.TREEZOR_TOKEN,
                secretKey: process.env.TREEZOR_SECRET_KEY,
            });
            try {
                const { businessinformations } = yield treezor.getBusinessInformations({
                    country: 'FR',
                    registrationNumber: siren,
                });
                const [info] = businessinformations;
                return {
                    capital: Number(info.legalShareCapital) || null,
                    legalAnnualTurnOver: info.legalAnnualTurnOver || null,
                    numberEmployees: info.legalNumberOfEmployeeRange || null,
                    legalNetIncomeRange: info.legalNetIncomeRange || null,
                    phone: (info.phone) ? info.phone.split(' ').join('') : null,
                };
            }
            catch (err) {
                throw new common_1.HttpException(err.message, err.statusCode);
            }
        });
    }
};
CompaniesService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(company_entity_1.Company)),
    __param(1, typeorm_1.InjectRepository(partner_entity_1.Partner)),
    __param(2, typeorm_1.InjectRepository(contact_entity_1.Contact)),
    __param(3, typeorm_1.InjectRepository(email_entity_1.Email)),
    __param(4, typeorm_1.InjectRepository(accounting_preference_entity_1.AccountingPreference)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        siren_service_1.SirenService])
], CompaniesService);
exports.CompaniesService = CompaniesService;
//# sourceMappingURL=companies.service.js.map