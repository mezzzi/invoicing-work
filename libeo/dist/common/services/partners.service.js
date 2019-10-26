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
const typeorm_2 = require("typeorm");
const partner_entity_1 = require("../entities/partner.entity");
const company_entity_1 = require("../entities/company.entity");
const companies_service_1 = require("./companies.service");
let PartnersService = class PartnersService {
    constructor(partnerRepository, companyRepository, companiesService) {
        this.partnerRepository = partnerRepository;
        this.companyRepository = companyRepository;
        this.companiesService = companiesService;
    }
    createPartner(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let companyPartner = yield this.companiesService.findOneBySiren(data.siren);
            if (!companyPartner) {
                companyPartner = yield this.companyRepository.create(data);
                yield this.companyRepository.save(companyPartner);
            }
            const companyInitiator = yield this.companiesService.getCurrentCompanyByUser(user);
            let relationship = yield this.findOneByCompanyInitiatorIdAndCompanyPartnerId(companyInitiator.id, companyPartner.id);
            if (!relationship) {
                relationship = this.partnerRepository.create({ companyInitiator, companyPartner });
                yield this.partnerRepository.save(relationship);
            }
            companyPartner.status = company_entity_1.CompanyStatus.ALREADY;
            return companyPartner;
        });
    }
    findOneByCompanyInitiatorIdAndCompanyPartnerId(companyInitiatorId, companyPartnerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.partnerRepository.findOne({ companyInitiator: { id: companyInitiatorId }, companyPartner: { id: companyPartnerId } });
        });
    }
    findByCompany(company, orderBy, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            const partners = yield this.partnerRepository.find({
                where: {
                    companyInitiator: company,
                },
                relations: ['companyPartner'],
                skip: offset,
                take: limit,
            });
            return partners.map(partner => {
                return partner.companyPartner;
            });
        });
    }
    countByCompany(company) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.partnerRepository.count({ companyInitiator: company });
        });
    }
    findOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.companyRepository.findOne({ id });
        });
    }
};
PartnersService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(partner_entity_1.Partner)),
    __param(1, typeorm_1.InjectRepository(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        companies_service_1.CompaniesService])
], PartnersService);
exports.PartnersService = PartnersService;
//# sourceMappingURL=partners.service.js.map