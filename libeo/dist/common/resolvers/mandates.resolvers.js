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
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("@nestjs/graphql");
const mandates_service_1 = require("../services/mandates.service");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let MandatesResolvers = class MandatesResolvers {
    constructor(mandatesService) {
        this.mandatesService = mandatesService;
    }
    createMandate(ctx, bankAccountId) {
        return this.mandatesService.createMandate(ctx.req.user, bankAccountId, ctx.req.headers['x-forwarded-for']);
    }
    generateCodeMandate(ctx, id) {
        return this.mandatesService.generateCodeMandate(ctx.req.user, id);
    }
    signedMandate(ctx, id, code) {
        return this.mandatesService.signedMandate(ctx.req.user, id, code);
    }
    removeMandate(ctx, id) {
        return this.mandatesService.removeMandate(ctx.req.user.currentCompany, id);
    }
    mandate(ctx, id) {
        return this.mandatesService.getMandate(ctx.req.user.currentCompany, id);
    }
};
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Args('bankAccountId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MandatesResolvers.prototype, "createMandate", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Args('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MandatesResolvers.prototype, "generateCodeMandate", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Args('id')), __param(2, graphql_1.Args('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], MandatesResolvers.prototype, "signedMandate", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Args('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MandatesResolvers.prototype, "removeMandate", null);
__decorate([
    graphql_1.Query(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Args('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MandatesResolvers.prototype, "mandate", null);
MandatesResolvers = __decorate([
    graphql_1.Resolver('Mandate'),
    __metadata("design:paramtypes", [mandates_service_1.MandatesService])
], MandatesResolvers);
exports.MandatesResolvers = MandatesResolvers;
//# sourceMappingURL=mandates.resolvers.js.map