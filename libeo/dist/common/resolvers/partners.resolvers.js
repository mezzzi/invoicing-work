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
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const partners_service_1 = require("../services/partners.service");
const companies_service_1 = require("../services/companies.service");
const company_entity_1 = require("../entities/company.entity");
let PartnersResolvers = class PartnersResolvers {
    constructor(partnersService, companiesService) {
        this.partnersService = partnersService;
        this.companiesService = companiesService;
    }
    createPartner(input, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.partnersService.createPartner(ctx.req.user, input);
        });
    }
    partners(ctx, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentCompany = yield this.companiesService.getCurrentCompanyByUser(ctx.req.user);
            const result = yield Promise.all([
                this.partnersService.findByCompany(currentCompany, null, limit, offset),
                this.partnersService.countByCompany(currentCompany),
            ]);
            return {
                total: result[1],
                rows: result[0],
            };
        });
    }
    partner(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.partnersService.findOneById(id);
        });
    }
};
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Args('input')), __param(1, graphql_1.Context()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [company_entity_1.Company, Object]),
    __metadata("design:returntype", Promise)
], PartnersResolvers.prototype, "createPartner", null);
__decorate([
    graphql_1.Query(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Args('limit')), __param(2, graphql_1.Args('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], PartnersResolvers.prototype, "partners", null);
__decorate([
    graphql_1.Query(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Args('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PartnersResolvers.prototype, "partner", null);
PartnersResolvers = __decorate([
    graphql_1.Resolver('Partner'),
    __metadata("design:paramtypes", [partners_service_1.PartnersService,
        companies_service_1.CompaniesService])
], PartnersResolvers);
exports.PartnersResolvers = PartnersResolvers;
//# sourceMappingURL=partners.resolvers.js.map