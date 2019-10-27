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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const treezor_service_1 = require("../../payment/treezor.service");
const utils_service_1 = require("../utils.service");
const common_1 = require("@nestjs/common");
let TreezorStrategy = class TreezorStrategy {
    constructor(treezorService) {
        this.treezorService = treezorService;
        this.baseUrl = process.env.TREEZOR_API_URL;
    }
    callApi(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { businesssearchs } = yield this.treezorService.getBusinessSearchs(data);
                return businesssearchs;
            }
            catch (err) {
                throw new common_1.HttpException(err.message, err.code);
            }
        });
    }
    search(q, orderBy, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = { country: 'FR' };
            const prefix = utils_service_1.getPrefixTypeSearchCompanies(q);
            if (prefix === utils_service_1.SearchCompaniesType.QUERY) {
                data.nameClosestKeywords = q;
            }
            else {
                data.registrationNumber = q;
            }
            const res = yield this.callApi(data);
            const status = ['N', 'I', 'A', 'T', 'S', 'K', 'O'];
            const companies = [];
            res.forEach(company => {
                if (status.includes(company.status) && company.officeType === 1) {
                    const siren = (company.legalRegistrationNumber) ? company.legalRegistrationNumber.slice(0, 9) : null;
                    companies.push({
                        source: 'OFFICIAL_TREEZOR',
                        siren,
                        siret: company.legalRegistrationNumber,
                        name: company.legalName,
                        brandName: company.tradename,
                        naf: company.activityType,
                        nafNorm: null,
                        numberEmployees: null,
                        legalForm: null,
                        category: null,
                        incorporationAt: null,
                        vatNumber: (siren) ? 'FR' + (12 + 3 * (siren % 97)) % 97 + siren : null,
                        addresses: [],
                    });
                }
            });
            let total = companies.length;
            if (companies.length > limit) {
                const nextResults = yield this.callApi(data);
                total += nextResults.length;
            }
            return {
                total,
                rows: companies,
            };
        });
    }
};
TreezorStrategy = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [treezor_service_1.TreezorService])
], TreezorStrategy);
exports.TreezorStrategy = TreezorStrategy;
//# sourceMappingURL=treezor.strategy.js.map