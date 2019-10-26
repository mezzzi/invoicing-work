"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const contextService = require("request-context");
const typeorm_1 = require("typeorm");
const company_entity_1 = require("../entities/company.entity");
const treezor_service_1 = require("../../payment/treezor.service");
const common_1 = require("@nestjs/common");
const histories_service_1 = require("../services/histories.service");
const history_entity_1 = require("../entities/history.entity");
const histories_dto_1 = require("../dto/histories.dto");
const user_interface_1 = require("../../payment/interfaces/treezor/user.interface");
const shortid = require("shortid");
let CompanySubscriber = class CompanySubscriber {
    delay(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(res => setTimeout(res, ms));
        });
    }
    createWallet(treezor, company) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = yield treezor.createWallet({
                    walletTypeId: 10,
                    userId: company.treezorUserId,
                    eventName: company.siren,
                    tariffId: parseInt(process.env.TREEZOR_TARIFFID, 10),
                    currency: 'EUR',
                });
                company.treezorWalletId = wallet.walletId || null;
                company.treezorIban = wallet.iban || null;
                company.treezorBic = wallet.bic || null;
                return company;
            }
            catch (err) {
                throw new common_1.HttpException(err.message, err.statusCode);
            }
        });
    }
    createMoralUser(treezor, company) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [address1] = company.addresses;
                const user = yield treezor.createUser({
                    email: `payment.${shortid.generate()}@libeo.io`,
                    userTypeId: 2,
                    legalRegistrationNumber: company.siren,
                    legalTvaNumber: company.vatNumber,
                    legalName: company.name || company.brandName || '',
                    legalForm: parseInt(company.legalForm, 10),
                    legalRegistrationDate: company.incorporationAt,
                    legalSector: company.naf,
                    legalNumberOfEmployeeRange: company.numberEmployees || '0',
                    legalAnnualTurnOver: company.legalAnnualTurnOver,
                    legalNetIncomeRange: company.legalNetIncomeRange,
                    phone: (company.phone) ? company.phone : '0000000000',
                    address1: (address1) ? address1.address1 : null,
                    city: (address1) ? address1.city : null,
                    postcode: (address1) ? JSON.stringify(address1.zipcode) : null,
                    country: 'FR',
                });
                company.treezorEmail = user.email || null;
                company.treezorUserId = user.userId || null;
                return company;
            }
            catch (err) {
                throw new common_1.HttpException(err.message, err.statusCode);
            }
        });
    }
    createPhysicalUsers(treezor, company) {
        return __awaiter(this, void 0, void 0, function* () {
            let users = [];
            try {
                const { businessinformations } = yield treezor.getBusinessInformations({
                    country: 'FR',
                    registrationNumber: company.siren,
                });
                const [info] = businessinformations;
                if (info && info.users) {
                    users = info.users;
                }
            }
            catch (err) {
                throw new common_1.HttpException(err.message, err.statusCode);
            }
            const promises = users.map((user) => __awaiter(this, void 0, void 0, function* () {
                if (user.userTypeId !== 1) {
                    return null;
                }
                try {
                    return yield treezor.createUser({
                        firstname: user.firstname || null,
                        lastname: user.lastname || null,
                        birthday: user.birthday || null,
                        occupation: user.parentType || null,
                        specifiedUSPerson: 0,
                        parentUserId: company.treezorUserId,
                        parentType: user_interface_1.UserParentType.LEADER,
                        email: `payment.${shortid.generate()}@libeo.io`,
                        userTypeId: 1,
                    });
                }
                catch (err) {
                    throw new common_1.HttpException(err.message, err.statusCode);
                }
            }));
            try {
                yield Promise.all(promises);
            }
            catch (err) {
                throw new common_1.HttpException(err.message, err.statusCode);
            }
        });
    }
    listenTo() {
        return company_entity_1.Company;
    }
    afterInsert(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!event.entity.claimer) {
                return;
            }
            const treezor = new treezor_service_1.TreezorService({
                baseUrl: process.env.TREEZOR_API_URL,
                token: process.env.TREEZOR_TOKEN,
                secretKey: process.env.TREEZOR_SECRET_KEY,
            });
            let company = event.entity;
            company = yield this.createMoralUser(treezor, company);
            yield this.delay(300);
            company = yield this.createWallet(treezor, company);
            yield this.createPhysicalUsers(treezor, company);
            yield event.manager.save(company);
        });
    }
    afterUpdate(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.entity.kycStatus !== event.databaseEntity.kycStatus) {
                const historiesService = new histories_service_1.HistoriesService(typeorm_1.getRepository('History'));
                historiesService.createHistory({
                    user: contextService.get('request:user'),
                    params: { kycStatus: event.entity.kycStatus },
                    entity: history_entity_1.HistoryEntity.COMPANY,
                    entityId: event.databaseEntity.id,
                    event: histories_dto_1.HistoryEvent.UPDATE_KYC_STATUS,
                });
            }
            if (!event.databaseEntity.siren) {
                const treezor = new treezor_service_1.TreezorService({
                    baseUrl: process.env.TREEZOR_API_URL,
                    token: process.env.TREEZOR_TOKEN,
                    secretKey: process.env.TREEZOR_SECRET_KEY,
                });
                let company = event.entity;
                company = yield this.createMoralUser(treezor, company);
                yield this.delay(300);
                company = yield this.createWallet(treezor, company);
                yield this.createPhysicalUsers(treezor, company);
                yield event.manager.save(company);
            }
        });
    }
};
CompanySubscriber = __decorate([
    typeorm_1.EventSubscriber()
], CompanySubscriber);
exports.CompanySubscriber = CompanySubscriber;
//# sourceMappingURL=company.subscriber.js.map