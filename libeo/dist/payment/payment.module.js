"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const treezor_api_1 = require("./treezor.api");
const treezor_service_1 = require("./treezor.service");
const typeorm_1 = require("@nestjs/typeorm");
const webhook_entity_1 = require("../common/entities/webhook.entity");
let PaymentModule = class PaymentModule {
};
PaymentModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([webhook_entity_1.Webhook])],
        providers: [
            treezor_api_1.TreezorAPI,
            treezor_service_1.TreezorService
        ],
        exports: [treezor_service_1.TreezorService, treezor_api_1.TreezorAPI]
    })
], PaymentModule);
exports.PaymentModule = PaymentModule;
//# sourceMappingURL=payment.module.js.map