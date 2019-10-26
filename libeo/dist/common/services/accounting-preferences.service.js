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
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("@nestjs/typeorm");
const accounting_preference_entity_1 = require("../entities/accounting-preference.entity");
let AccountingPreferencesService = class AccountingPreferencesService {
    constructor(accountingPreferenceRepository) {
        this.accountingPreferenceRepository = accountingPreferenceRepository;
    }
    createOrUpdateAccountingPreferences(currentCompany, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const input = [];
            data.forEach(accountingPreference => {
                accountingPreference.company = currentCompany;
                input.push(this.accountingPreferenceRepository.create(accountingPreference));
            });
            try {
                yield this.accountingPreferenceRepository.save(input);
            }
            catch (err) {
                throw new common_1.HttpException('api.error.accounting-preference.save', common_1.HttpStatus.BAD_REQUEST);
            }
            const [accountingPreferences, total] = yield this.accountingPreferenceRepository.findAndCount({ company: currentCompany });
            return {
                total,
                rows: accountingPreferences,
            };
        });
    }
    findByTypes(currentCompany, types, defaultOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!currentCompany) {
                throw new common_1.HttpException('api.error.company.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            const where = { company: currentCompany };
            const orWhere = { company: null };
            if (types) {
                where.type = typeorm_1.In(types);
                orWhere.type = typeorm_1.In(types);
            }
            const whereClause = [where];
            if (defaultOptions) {
                whereClause.push(orWhere);
            }
            const [accountingPreferences, total] = yield this.accountingPreferenceRepository.findAndCount({
                where: whereClause,
                relations: ['company'],
                order: {
                    order: 'ASC',
                },
            });
            return {
                total,
                rows: accountingPreferences,
            };
        });
    }
};
AccountingPreferencesService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_2.InjectRepository(accounting_preference_entity_1.AccountingPreference)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], AccountingPreferencesService);
exports.AccountingPreferencesService = AccountingPreferencesService;
//# sourceMappingURL=accounting-preferences.service.js.map