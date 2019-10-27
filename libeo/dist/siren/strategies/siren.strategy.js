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
const moment = require("moment");
const rp = require("request-promise-native");
const apollo_server_env_1 = require("apollo-server-env");
const common_1 = require("@nestjs/common");
const utils_service_1 = require("../utils.service");
const nestjs_config_1 = require("nestjs-config");
let SirenStrategy = class SirenStrategy {
    constructor(config) {
        this.baseUrl = process.env.SIREN_API_URL;
        this.endpoint = this.baseUrl + '/entreprises/sirene/V3';
        this.bearerToken = process.env.SIREN_BEARER_TOKEN;
        this.basicToken = process.env.SIREN_BASIC_TOKEN;
        const sirenConfig = config.get('siren');
        this.baseUrl = sirenConfig.SIREN_API_URL;
        this.endpoint = this.baseUrl + '/entreprises/sirene/V3';
        this.bearerToken = sirenConfig.SIREN_BEARER_TOKEN;
        this.basicToken = sirenConfig.SIREN_BASIC_TOKEN;
    }
    serialize(data) {
        const addressNumber = (data.adresseEtablissement.numeroVoieEtablissement) ? data.adresseEtablissement.numeroVoieEtablissement + ' ' : '';
        const addressNumberComplement = (data.adresseEtablissement.indiceRepetitionEtablissement) ? data.adresseEtablissement.indiceRepetitionEtablissement + ' ' : '';
        const addressStreet = (data.adresseEtablissement.typeVoieEtablissement && data.adresseEtablissement.libelleVoieEtablissement) ? data.adresseEtablissement.typeVoieEtablissement + ' ' + data.adresseEtablissement.libelleVoieEtablissement : '';
        return {
            source: 'OFFICIAL_SIREN',
            siren: data.siren || null,
            siret: data.siret || null,
            name: data.uniteLegale.denominationUniteLegale || null,
            naf: data.uniteLegale.activitePrincipaleUniteLegale || null,
            nafNorm: data.uniteLegale.nomenclatureActivitePrincipaleUniteLegale || null,
            brandName: data.uniteLegale.denominationUsuelle1UniteLegale || null,
            numberEmployees: data.uniteLegale.trancheEffectifsUniteLegale || null,
            legalForm: data.uniteLegale.categorieJuridiqueUniteLegale || null,
            category: data.uniteLegale.categorieEntreprise || null,
            incorporationAt: (data.dateCreationEtablissement) ? new Date(data.dateCreationEtablissement) : null,
            vatNumber: (data.siren) ? 'FR' + (12 + 3 * (data.siren % 97)) % 97 + data.siren : null,
            addresses: {
                total: 1,
                rows: [{
                        siret: data.siret || null,
                        address1: addressNumber + addressNumberComplement + addressStreet,
                        address2: null,
                        zipcode: data.adresseEtablissement.codePostalEtablissement || null,
                        city: data.adresseEtablissement.libelleCommuneEtablissement || null,
                        country: 'France',
                    }],
            },
        };
    }
    refreshToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield apollo_server_env_1.fetch(this.baseUrl + '/token', {
                method: 'POST',
                credentials: 'include',
                body: 'grant_type=client_credentials',
                headers: {
                    'Authorization': 'Basic ' + this.basicToken,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            if (response.status !== common_1.HttpStatus.OK) {
                throw new common_1.HttpException(response.statusText, response.status);
            }
            const { access_token } = yield response.json();
            return access_token;
        });
    }
    search(query, orderBy, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            const q = query;
            const date = moment().format('YYYY-MM-DD');
            const fields = [
                'siren',
                'siret',
                'denominationUniteLegale',
                'activitePrincipaleUniteLegale',
                'nomenclatureActivitePrincipaleUniteLegale',
                'denominationUsuelle1UniteLegale',
                'trancheEffectifsUniteLegale',
                'categorieJuridiqueUniteLegale',
                'categorieEntreprise',
                'dateCreationEtablissement',
                'numeroVoieEtablissement',
                'indiceRepetitionEtablissement',
                'typeVoieEtablissement',
                'libelleVoieEtablissement',
                'codePostalEtablissement',
                'libelleCommuneEtablissement',
            ];
            const prefix = utils_service_1.getPrefixTypeSearchCompanies(query);
            let additionalConditions = ' AND etatAdministratifUniteLegale:"A" AND etatAdministratifUniteLegale:"A"';
            if (prefix !== utils_service_1.SearchCompaniesType.SIRET) {
                additionalConditions += ' AND etablissementSiege:"true"';
            }
            if (prefix === utils_service_1.SearchCompaniesType.QUERY) {
                let words = query.split(' ');
                const nbWords = words.length;
                words = words.map((word, index) => {
                    if (index === 0) {
                        return `${utils_service_1.SearchCompaniesType.QUERY}:"*${word}"`;
                    }
                    else if (index === (nbWords - 1)) {
                        return `${utils_service_1.SearchCompaniesType.QUERY}:"${word}*"`;
                    }
                    else {
                        return `${utils_service_1.SearchCompaniesType.QUERY}:"*${word}"`;
                    }
                });
                query = words.join(' AND ');
            }
            else {
                query = `${prefix}:"${query}"`;
            }
            const url = `${this.endpoint}/siret?q=${query}${additionalConditions}&champs=${fields.join()}&debut=${(offset || 0)}&nombre=${(limit || 10)}&date=${date}`;
            try {
                const response = yield rp.get(url, {
                    headers: {
                        Authorization: 'Bearer ' + this.bearerToken,
                    },
                    timeout: 3000,
                    json: true,
                });
                const companies = [];
                let total = 0;
                if (response) {
                    total = response.header.total;
                    yield response.etablissements.forEach((element, index) => __awaiter(this, void 0, void 0, function* () {
                        companies.push(this.serialize(element));
                    }));
                }
                return {
                    total,
                    rows: companies,
                };
            }
            catch (err) {
                if (err.error && err.error.code && (err.error.code === 'ETIMEDOUT' || err.error.code === 'ESOCKETTIMEDOUT')) {
                    throw err;
                }
                if (err.statusCode === common_1.HttpStatus.UNAUTHORIZED) {
                    this.bearerToken = yield this.refreshToken();
                    return this.search(q, orderBy, limit, offset);
                }
                throw new common_1.HttpException(err.message, err.statusCode);
            }
        });
    }
};
SirenStrategy = __decorate([
    common_1.Injectable(),
    __param(0, nestjs_config_1.InjectConfig()),
    __metadata("design:paramtypes", [nestjs_config_1.ConfigService])
], SirenStrategy);
exports.SirenStrategy = SirenStrategy;
//# sourceMappingURL=siren.strategy.js.map