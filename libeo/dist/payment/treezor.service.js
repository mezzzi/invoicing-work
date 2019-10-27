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
const treezor_api_1 = require("./treezor.api");
const common_1 = require("@nestjs/common");
const nestjs_config_1 = require("nestjs-config");
let TreezorService = class TreezorService {
    constructor(treezorApi, configService) {
        this.treezorApi = treezorApi;
        this.config = configService.get('treezor');
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.treezorApi.mutation('/users', { body: data });
        });
    }
    updateUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.treezorApi.mutation(`/users/${data.userId}`, { body: data, method: treezor_api_1.MutationMethod.PUT });
        });
    }
    removeUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = data;
            delete data.userId;
            return this.treezorApi.mutation(`/users/${userId}`, { body: data, method: treezor_api_1.MutationMethod.DELETE });
        });
    }
    createTaxResidence(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.treezorApi.mutation('/taxResidences', { body: data });
        });
    }
    updateTaxResidence(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { taxResidenceId } = data;
            delete data.taxResidenceId;
            return this.treezorApi.mutation(`/taxResidences/${taxResidenceId}`, { body: data, method: treezor_api_1.MutationMethod.PUT });
        });
    }
    createWallet(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.treezorApi.mutation('/wallets', { body: data, objectIdKey: 'walletId' });
        });
    }
    createDocument(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.file) {
                return null;
            }
            const file = yield data.file;
            const base64 = new Promise((resolve, reject) => {
                const chunks = [];
                file.createReadStream()
                    .on('error', reject)
                    .on('data', (chunk) => chunks.push(chunk))
                    .on('close', () => resolve(Buffer.concat(chunks).toString('base64')));
            });
            delete data.file;
            data.fileContentBase64 = yield base64;
            return this.treezorApi.mutation('/documents', { form: data, objectIdKey: 'documentId', sign: false });
        });
    }
    createBeneficiary(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.treezorApi.mutation('/beneficiaries', { body: data });
        });
    }
    createPayout(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.treezorApi.mutation('/payouts', { body: data });
        });
    }
    deletePayout(payoutId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.treezorApi.mutation(`/payouts/${payoutId}`, { method: treezor_api_1.MutationMethod.DELETE });
        });
    }
    createPayin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            data.paymentMethodId = 21;
            data.messageToUser = data.messageToUser.slice(0, 140);
            return this.treezorApi.mutation('/payins', { body: data });
        });
    }
    deletePayin(payinId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.treezorApi.mutation(`/payins/${payinId}`, { method: treezor_api_1.MutationMethod.DELETE });
        });
    }
    deleteDocument(documentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.treezorApi.mutation(`/documents/${documentId}`, { method: treezor_api_1.MutationMethod.DELETE });
        });
    }
    getTransactions(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.treezorApi.query('/transactions', { qs: params });
        });
    }
    getBalances(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.treezorApi.query('/balances', { qs: params });
        });
    }
    getBusinessInformations(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.treezorApi.query('/businessinformations', { qs: params, sign: false });
        });
    }
    getBeneficiaries(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.treezorApi.query('/users', { qs: params });
        });
    }
    getBeneficiary(beneficiaryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.treezorApi.query(`/beneficiaries/${beneficiaryId}`, {})
                .then(res => {
                const { beneficiaries } = res;
                const [beneficiary] = beneficiaries;
                Promise.resolve(beneficiary);
            });
        });
    }
    getDocuments(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.treezorApi.query('/documents', { qs: params });
        });
    }
    getUser(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = params;
            delete params.userId;
            return this.treezorApi.query(`/users/${userId}`, { qs: params })
                .then(res => {
                const { users } = res;
                const [user] = users;
                Promise.resolve(user);
            });
        });
    }
    getTaxResidence(userId, country) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.treezorApi.query(`/taxResidences`, { qs: { userId } })
                .then(res => {
                const { taxResidences } = res;
                Promise.resolve(taxResidences.find((taxResidence) => {
                    if (country === taxResidence.country && !taxResidence.isDeleted) {
                        return taxResidence;
                    }
                }));
            });
        });
    }
    kycReview(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = data;
            delete data.userId;
            return this.treezorApi.mutation(`/users/${userId}/Kycreview/`, { body: data, method: treezor_api_1.MutationMethod.PUT });
        });
    }
    createMandate(data) {
        const body = Object.assign({}, data, { userId: this.config.treezorAccountLibeo });
        return this.treezorApi.mutation('/mandates', { body });
    }
    deleteMandate(data) {
        const { mandateId } = data;
        delete data.mandateId;
        return this.treezorApi.mutation(`/mandates/${mandateId}`, { body: data, method: treezor_api_1.MutationMethod.DELETE });
    }
    getBusinessSearchs(data) {
        return this.treezorApi.query('/businesssearchs', { qs: data });
    }
};
TreezorService = __decorate([
    common_1.Injectable(),
    __param(1, nestjs_config_1.InjectConfig()),
    __metadata("design:paramtypes", [treezor_api_1.TreezorAPI,
        nestjs_config_1.ConfigService])
], TreezorService);
exports.TreezorService = TreezorService;
//# sourceMappingURL=treezor.service.js.map