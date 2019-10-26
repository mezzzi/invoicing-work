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
const graphql_1 = require("@nestjs/graphql");
const balances_service_1 = require("../services/balances.service");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let BalancesResolver = class BalancesResolver {
    constructor(balancesService) {
        this.balancesService = balancesService;
    }
    balance(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.balancesService.getBalance(ctx.req.user.currentCompany);
        });
    }
    checkBalance(ctx, invoiceId, paymentAt) {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield this.balancesService.getBalance(ctx.req.user.currentCompany);
            return this.balancesService.checkBalance(balance, ctx.req.user.currentCompany, invoiceId, paymentAt);
        });
    }
};
__decorate([
    graphql_1.Query(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BalancesResolver.prototype, "balance", null);
__decorate([
    graphql_1.Query(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Args('invoiceId')), __param(2, graphql_1.Args('paymentAt')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Date]),
    __metadata("design:returntype", Promise)
], BalancesResolver.prototype, "checkBalance", null);
BalancesResolver = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [balances_service_1.BalancesService])
], BalancesResolver);
exports.BalancesResolver = BalancesResolver;
//# sourceMappingURL=balances.resolvers.js.map