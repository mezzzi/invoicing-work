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
const payments_service_1 = require("../services/payments.service");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let PaymentsResolvers = class PaymentsResolvers {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    payout(ctx, invoiceId, date, code) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.paymentsService.payout(ctx.req.user, invoiceId, date, code);
        });
    }
    payoutContacts(ctx, invoiceId, contactIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.paymentsService.payoutContacts(ctx.req.user, invoiceId, contactIds);
        });
    }
};
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Args('invoiceId')), __param(2, graphql_1.Args('date')), __param(3, graphql_1.Args('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Date, String]),
    __metadata("design:returntype", Promise)
], PaymentsResolvers.prototype, "payout", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Args('invoiceId')), __param(2, graphql_1.Args('contactIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Array]),
    __metadata("design:returntype", Promise)
], PaymentsResolvers.prototype, "payoutContacts", null);
PaymentsResolvers = __decorate([
    graphql_1.Resolver('Payment'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsResolvers);
exports.PaymentsResolvers = PaymentsResolvers;
//# sourceMappingURL=payments.resolvers.js.map