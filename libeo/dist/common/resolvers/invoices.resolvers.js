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
const invoice_entity_1 = require("../entities/invoice.entity");
const invoices_service_1 = require("../services/invoices.service");
const histories_service_1 = require("../services/histories.service");
const payments_service_1 = require("../services/payments.service");
let InvoicesResolvers = class InvoicesResolvers {
    constructor(invoicesService, paymentsService, historiesService) {
        this.invoicesService = invoicesService;
        this.paymentsService = paymentsService;
        this.historiesService = historiesService;
    }
    uploadRib(file, invoiceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.invoicesService.uploadRib(file, invoiceId);
        });
    }
    createInvoice(ctx, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.invoicesService.createInvoice(ctx.req.user, input);
        });
    }
    createOrUpdateAR(ctx, id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.invoicesService.createOrUpdateAR(ctx.req.user, id, input);
        });
    }
    updateInvoice(ctx, id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.invoicesService.updateInvoice(ctx.req.user, id, input);
        });
    }
    updateInvoiceStatus(ctx, id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.paymentsService.updateInvoiceStatus(id, status, ctx.req.user);
        });
    }
    removeInvoice(ctx, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.invoicesService.removeInvoice(ctx.req.user, id);
        });
    }
    removeAll(input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.invoicesService.removeAll();
        });
    }
    generateCode(ctx, invoiceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.invoicesService.generateCode(ctx.req.user, invoiceId);
        });
    }
    invoices(ctx, filters, orderBy, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.invoicesService.findByCompany(ctx.req.user.currentCompany, filters, orderBy, limit, offset);
        });
    }
    emittedInvoices(ctx, filters, orderBy, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.invoicesService.findByEmitterCompany(ctx.req.user.currentCompany, filters, orderBy, limit, offset);
        });
    }
    invoice(ctx, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.invoicesService.findOneByIdAndCurrentCompany(id, ctx.req.user.currentCompany);
        });
    }
    emittedInvoice(ctx, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.invoicesService.findOneByIdAndEmitterCompany(id, ctx.req.user.currentCompany);
        });
    }
    estimatedBalance(invoice) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.invoicesService.findEstimatedBalance(invoice);
        });
    }
    paymentAt(invoice) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.invoicesService.findPaymentAt(invoice);
        });
    }
    history(invoice, orderBy, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.historiesService.findByInvoiceId(invoice.id, orderBy, limit, offset);
        });
    }
};
__decorate([
    graphql_1.Mutation(),
    __param(0, graphql_1.Args('file')), __param(1, graphql_1.Args('invoiceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InvoicesResolvers.prototype, "uploadRib", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()),
    __param(1, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InvoicesResolvers.prototype, "createInvoice", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()),
    __param(1, graphql_1.Args('id')),
    __param(2, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], InvoicesResolvers.prototype, "createOrUpdateAR", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()),
    __param(1, graphql_1.Args('id')),
    __param(2, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], InvoicesResolvers.prototype, "updateInvoice", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Args('id')), __param(2, graphql_1.Args('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], InvoicesResolvers.prototype, "updateInvoiceStatus", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()),
    __param(1, graphql_1.Args('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InvoicesResolvers.prototype, "removeInvoice", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean]),
    __metadata("design:returntype", Promise)
], InvoicesResolvers.prototype, "removeAll", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()),
    __param(1, graphql_1.Args('invoiceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InvoicesResolvers.prototype, "generateCode", null);
__decorate([
    graphql_1.Query(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()),
    __param(1, graphql_1.Args('filters')),
    __param(2, graphql_1.Args('orderBy')),
    __param(3, graphql_1.Args('limit')),
    __param(4, graphql_1.Args('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, Number, Number]),
    __metadata("design:returntype", Promise)
], InvoicesResolvers.prototype, "invoices", null);
__decorate([
    graphql_1.Query(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()),
    __param(1, graphql_1.Args('filters')),
    __param(2, graphql_1.Args('orderBy')),
    __param(3, graphql_1.Args('limit')),
    __param(4, graphql_1.Args('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, Number, Number]),
    __metadata("design:returntype", Promise)
], InvoicesResolvers.prototype, "emittedInvoices", null);
__decorate([
    graphql_1.Query(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()),
    __param(1, graphql_1.Args('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InvoicesResolvers.prototype, "invoice", null);
__decorate([
    graphql_1.Query(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()),
    __param(1, graphql_1.Args('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InvoicesResolvers.prototype, "emittedInvoice", null);
__decorate([
    graphql_1.ResolveProperty(),
    __param(0, graphql_1.Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [invoice_entity_1.Invoice]),
    __metadata("design:returntype", Promise)
], InvoicesResolvers.prototype, "estimatedBalance", null);
__decorate([
    graphql_1.ResolveProperty(),
    __param(0, graphql_1.Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [invoice_entity_1.Invoice]),
    __metadata("design:returntype", Promise)
], InvoicesResolvers.prototype, "paymentAt", null);
__decorate([
    graphql_1.ResolveProperty(),
    __param(0, graphql_1.Parent()), __param(1, graphql_1.Args('orderBy')), __param(2, graphql_1.Args('limit')), __param(3, graphql_1.Args('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [invoice_entity_1.Invoice, String, Number, Number]),
    __metadata("design:returntype", Promise)
], InvoicesResolvers.prototype, "history", null);
InvoicesResolvers = __decorate([
    graphql_1.Resolver('Invoice'),
    __metadata("design:paramtypes", [invoices_service_1.InvoicesService,
        payments_service_1.PaymentsService,
        histories_service_1.HistoriesService])
], InvoicesResolvers);
exports.InvoicesResolvers = InvoicesResolvers;
//# sourceMappingURL=invoices.resolvers.js.map