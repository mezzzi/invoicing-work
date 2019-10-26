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
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const bank_account_service_1 = require("../services/bank-account.service");
const bank_account_dto_1 = require("../dto/bank-account.dto");
let BankAccountResolver = class BankAccountResolver {
    constructor(bankAccountService) {
        this.bankAccountService = bankAccountService;
    }
    createOrUpdateBankAccount(ctx, input, id) {
        return this.bankAccountService.createOrUpdateBankAccount(ctx.req.user.currentCompany, ctx.req.user, input, id);
    }
    changeDefaultBankAccount(ctx, id) {
        return this.bankAccountService.changeDefaultBankAccount(ctx.req.user.currentCompany, id);
    }
    removeBankAccount(ctx, id) {
        return this.bankAccountService.removeBankAccount(ctx.req.user.currentCompany, id);
    }
    bankAccounts(ctx) {
        return this.bankAccountService.getBankAccounts(ctx.req.user.currentCompany);
    }
    bankAccount(ctx, id) {
        return this.bankAccountService.getBankAccount(ctx.req.user.currentCompany, id);
    }
};
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Args('input')), __param(2, graphql_1.Args('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, bank_account_dto_1.CreateOrUpdateBankAccountDto, String]),
    __metadata("design:returntype", Promise)
], BankAccountResolver.prototype, "createOrUpdateBankAccount", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Args('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BankAccountResolver.prototype, "changeDefaultBankAccount", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Args('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BankAccountResolver.prototype, "removeBankAccount", null);
__decorate([
    graphql_1.Query(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BankAccountResolver.prototype, "bankAccounts", null);
__decorate([
    graphql_1.Query(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Args('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BankAccountResolver.prototype, "bankAccount", null);
BankAccountResolver = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [bank_account_service_1.BankAccountService])
], BankAccountResolver);
exports.BankAccountResolver = BankAccountResolver;
//# sourceMappingURL=bank-accounts.resolvers.js.map