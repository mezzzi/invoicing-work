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
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let BeneficiariesResolvers = class BeneficiariesResolvers {
    constructor(companiesService) {
        this.companiesService = companiesService;
    }
    createBeneficiary(ctx, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.companiesService.createBeneficiary(ctx.req.user, input);
        });
    }
    removeBeneficiary(ctx, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.companiesService.removeBeneficiary(ctx.req.user.currentCompany, id);
        });
    }
    beneficiaries(ctx, limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.companiesService.getBeneficiaries(ctx.req.user.currentCompany, limit, page);
        });
    }
    taxResidence(userId, country) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.companiesService.getTaxResidence(userId, country);
        });
    }
    documents(beneficiary, limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.companiesService.getDocuments(beneficiary.userId, limit, page);
        });
    }
};
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BeneficiariesResolvers.prototype, "createBeneficiary", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Args('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], BeneficiariesResolvers.prototype, "removeBeneficiary", null);
__decorate([
    graphql_1.Query(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Args('limit')), __param(2, graphql_1.Args('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], BeneficiariesResolvers.prototype, "beneficiaries", null);
__decorate([
    graphql_1.Query(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Args('userId')), __param(1, graphql_1.Args('country')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], BeneficiariesResolvers.prototype, "taxResidence", null);
__decorate([
    graphql_1.ResolveProperty(),
    __param(0, graphql_1.Parent()), __param(1, graphql_1.Args('limit')), __param(2, graphql_1.Args('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], BeneficiariesResolvers.prototype, "documents", null);
BeneficiariesResolvers = __decorate([
    graphql_1.Resolver('Beneficiary'),
    __metadata("design:paramtypes", [companies_service_1.CompaniesService])
], BeneficiariesResolvers);
exports.BeneficiariesResolvers = BeneficiariesResolvers;
//# sourceMappingURL=beneficiaries.resolvers.js.map