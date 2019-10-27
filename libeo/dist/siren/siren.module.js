"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const siren_service_1 = require("./siren.service");
const siren_strategy_1 = require("./strategies/siren.strategy");
const treezor_strategy_1 = require("./strategies/treezor.strategy");
const payment_module_1 = require("../payment/payment.module");
let SirenModule = class SirenModule {
};
SirenModule = __decorate([
    common_1.Module({
        imports: [payment_module_1.PaymentModule],
        providers: [siren_strategy_1.SirenStrategy, treezor_strategy_1.TreezorStrategy, siren_service_1.SirenService, common_1.Logger],
        exports: [siren_service_1.SirenService]
    })
], SirenModule);
exports.SirenModule = SirenModule;
//# sourceMappingURL=siren.module.js.map