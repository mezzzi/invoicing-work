"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_service_1 = require("./utils.service");
class TreezorService {
    constructor(config) {
        this.utils = new utils_service_1.Utils(config);
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.utils.mutation('/users', { body: data });
        });
    }
    updateUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.utils.mutation(`/users/${data.userId}`, { body: data, method: utils_service_1.MutationMethod.PUT });
        });
    }
    removeUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = data;
            delete data.userId;
            return this.utils.mutation(`/users/${userId}`, { body: data, method: utils_service_1.MutationMethod.DELETE });
        });
    }
    createTaxResidence(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.utils.mutation('/taxResidences', { body: data });
        });
    }
    updateTaxResidence(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { taxResidenceId } = data;
            delete data.taxResidenceId;
            return this.utils.mutation(`/taxResidences/${taxResidenceId}`, { body: data, method: utils_service_1.MutationMethod.PUT });
        });
    }
    createWallet(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.utils.mutation('/wallets', { body: data, objectIdKey: 'walletId' });
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
            data.fileContentBase64 = yield base64;
            delete data.file;
            return this.utils.mutation('/documents', { form: data, objectIdKey: 'documentId', sign: false });
        });
    }
    createBeneficiary(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.utils.mutation('/beneficiaries', { body: data });
        });
    }
    createPayout(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.utils.mutation('/payouts', { body: data });
        });
    }
    deletePayout(payoutId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.utils.mutation(`/payouts/${payoutId}`, { method: utils_service_1.MutationMethod.DELETE });
        });
    }
    deleteDocument(documentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.utils.mutation(`/documents/${documentId}`, { method: utils_service_1.MutationMethod.DELETE });
        });
    }
    getTransactions(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.utils.query('/transactions', { qs: params });
        });
    }
    getBalances(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.utils.query('/balances', { qs: params });
        });
    }
    getBusinessInformations(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.utils.query('/businessinformations', { qs: params, sign: false });
        });
    }
    getBeneficiaries(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.utils.query('/users', { qs: params });
        });
    }
    getBeneficiary(beneficiaryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.utils.query(`/beneficiaries/${beneficiaryId}`, {})
                .then(res => {
                const { beneficiaries } = res;
                const [beneficiary] = beneficiaries;
                Promise.resolve(beneficiary);
            });
        });
    }
    getDocuments(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.utils.query('/documents', { qs: params });
        });
    }
    getUser(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = params;
            delete params.userId;
            return this.utils.query(`/users/${userId}`, { qs: params })
                .then(res => {
                const { users } = res;
                const [user] = users;
                Promise.resolve(user);
            });
        });
    }
    getTaxResidence(userId, country) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.utils.query(`/taxResidences`, { qs: { userId } })
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
            return this.utils.mutation(`/users/${userId}/Kycreview/`, { body: data, method: utils_service_1.MutationMethod.PUT });
        });
    }
    createMandate(data) {
        return this.utils.mutation('/mandates', { body: data });
    }
    deleteMandate(data) {
        const { mandateId } = data;
        delete data.mandateId;
        return this.utils.mutation(`/mandates/${mandateId}`, { body: data, method: utils_service_1.MutationMethod.DELETE });
    }
    getBusinessSearchs(data) {
        return this.utils.query('/businesssearchs', { qs: data });
    }
}
exports.TreezorService = TreezorService;
//# sourceMappingURL=treezor.service.js.map