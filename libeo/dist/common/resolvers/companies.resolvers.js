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
const graphql_1 = require("@nestjs/graphql");
const companies_service_1 = require("../services/companies.service");
const company_entity_1 = require("../entities/company.entity");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const addresses_service_1 = require("../services/addresses.service");
const contacts_service_1 = require("../services/contacts.service");
const invoices_service_1 = require("../services/invoices.service");
const ibans_service_1 = require("../services/ibans.service");
let CompaniesResolvers = class CompaniesResolvers {
    constructor(companiesService, addressesService, contactsService, invoicesService, ibansService) {
        this.companiesService = companiesService;
        this.addressesService = addressesService;
        this.contactsService = contactsService;
        this.invoicesService = invoicesService;
        this.ibansService = ibansService;
    }
    createOrUpdateCompany(ctx, id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.companiesService.createOrUpdateCompany(ctx.req.user, input, id);
        });
    }
    signContract(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.companiesService.signContract(ctx.req.user);
        });
    }
    updateKycStatus(ctx, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.companiesService.updateKycStatus(ctx.req.user, status);
        });
    }
    removeDocument(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.companiesService.removeDocument(id);
        });
    }
    updateKycStep(ctx, step) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.companiesService.updateKycStep(ctx.req.user.currentCompany, step);
        });
    }
    uploadLogo(ctx, file) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.companiesService.uploadLogo(file, ctx.req.user.currentCompany);
        });
    }
    searchCompanies(query, orderBy, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.companiesService.searchCompanies(query, orderBy, limit, offset);
        });
    }
    company(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            return ctx.req.user.currentCompany;
        });
    }
    contract(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.companiesService.getContract(ctx.req.user.currentCompany);
        });
    }
    representatives(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.companiesService.getRepresentatives(ctx.req.user.currentCompany);
        });
    }
    companyWithComplementaryInfos(siren) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.companiesService.getCompanyComplementaryInfos(siren);
        });
    }
    status(ctx, company) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.companiesService.getStatus(ctx.req.user, company);
        });
    }
    addresses(company, orderBy, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!company.id) {
                return company.addresses;
            }
            const total = yield this.addressesService.countByCompany(company);
            const addresses = yield this.addressesService.findByCompany(company, orderBy, limit, offset);
            return {
                total,
                rows: addresses,
            };
        });
    }
    contacts(ctx, company, orderBy, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.contactsService.findByCompany(ctx.req.user, company, orderBy, limit, offset);
        });
    }
    invoicesSent(ctx, company) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.invoicesService.invoicesSent(ctx.req.user.currentCompany, company);
        });
    }
    invoicesReceived(ctx, company) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.invoicesService.invoicesReceived(ctx.req.user.currentCompany, company);
        });
    }
    ibans(company) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.ibansService.findByCompany(company);
        });
    }
};
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Args('id')), __param(2, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, company_entity_1.Company]),
    __metadata("design:returntype", Promise)
], CompaniesResolvers.prototype, "createOrUpdateCompany", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CompaniesResolvers.prototype, "signContract", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Args('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CompaniesResolvers.prototype, "updateKycStatus", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Args('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CompaniesResolvers.prototype, "removeDocument", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Args('step')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CompaniesResolvers.prototype, "updateKycStep", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Args('file')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CompaniesResolvers.prototype, "uploadLogo", null);
__decorate([
    graphql_1.Query(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Args('query')), __param(1, graphql_1.Args('orderBy')), __param(2, graphql_1.Args('limit')), __param(3, graphql_1.Args('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], CompaniesResolvers.prototype, "searchCompanies", null);
__decorate([
    graphql_1.Query(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CompaniesResolvers.prototype, "company", null);
__decorate([
    graphql_1.Query(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CompaniesResolvers.prototype, "contract", null);
__decorate([
    graphql_1.Query(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CompaniesResolvers.prototype, "representatives", null);
__decorate([
    graphql_1.Query(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Args('siren')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CompaniesResolvers.prototype, "companyWithComplementaryInfos", null);
__decorate([
    graphql_1.ResolveProperty(),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, company_entity_1.Company]),
    __metadata("design:returntype", Promise)
], CompaniesResolvers.prototype, "status", null);
__decorate([
    graphql_1.ResolveProperty(),
    __param(0, graphql_1.Parent()), __param(1, graphql_1.Args('orderBy')), __param(2, graphql_1.Args('limit')), __param(3, graphql_1.Args('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [company_entity_1.Company, String, Number, Number]),
    __metadata("design:returntype", Promise)
], CompaniesResolvers.prototype, "addresses", null);
__decorate([
    graphql_1.ResolveProperty(),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Parent()), __param(2, graphql_1.Args('orderBy')), __param(3, graphql_1.Args('limit')), __param(4, graphql_1.Args('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, company_entity_1.Company, String, Number, Number]),
    __metadata("design:returntype", Promise)
], CompaniesResolvers.prototype, "contacts", null);
__decorate([
    graphql_1.ResolveProperty(),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, company_entity_1.Company]),
    __metadata("design:returntype", Promise)
], CompaniesResolvers.prototype, "invoicesSent", null);
__decorate([
    graphql_1.ResolveProperty(),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, company_entity_1.Company]),
    __metadata("design:returntype", Promise)
], CompaniesResolvers.prototype, "invoicesReceived", null);
__decorate([
    graphql_1.ResolveProperty(),
    __param(0, graphql_1.Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [company_entity_1.Company]),
    __metadata("design:returntype", Promise)
], CompaniesResolvers.prototype, "ibans", null);
CompaniesResolvers = __decorate([
    graphql_1.Resolver('Company'),
    __metadata("design:paramtypes", [companies_service_1.CompaniesService,
        addresses_service_1.AddressesService,
        contacts_service_1.ContactsService,
        invoices_service_1.InvoicesService,
        ibans_service_1.IbansService])
], CompaniesResolvers);
exports.CompaniesResolvers = CompaniesResolvers;
//# sourceMappingURL=companies.resolvers.js.map