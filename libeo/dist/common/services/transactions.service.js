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
const treezor_service_1 = require("../../payment/treezor.service");
let TransactionsService = class TransactionsService {
    constructor(treezorService) {
        this.treezorService = treezorService;
    }
    findByCompany(company, limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!company || !company.treezorWalletId) {
                return {
                    total: 0,
                    rows: [],
                };
            }
            let transactions = [];
            try {
                const result = yield this.treezorService.getTransactions({ walletId: company.treezorWalletId, pageNumber: page, pageCount: limit });
                transactions = result.transactions;
            }
            catch (err) {
                throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_GATEWAY);
            }
            return {
                total: transactions.length,
                rows: transactions,
            };
        });
    }
};
TransactionsService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [treezor_service_1.TreezorService])
], TransactionsService);
exports.TransactionsService = TransactionsService;
//# sourceMappingURL=transactions.service.js.map