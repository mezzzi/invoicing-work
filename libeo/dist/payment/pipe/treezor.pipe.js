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
const webhook_entity_1 = require("../../common/entities/webhook.entity");
const treezor_api_1 = require("../treezor.api");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let TreezorSignatureValidationPipe = class TreezorSignatureValidationPipe {
    constructor(treezorApi) {
        this.treezorApi = treezorApi;
    }
    transform(body) {
        if (!body.objectPayload)
            throw new common_1.BadRequestException('object_payload is empty');
        if (process.env.NODE_ENV === 'development')
            return body;
        if (process.env.TREEZOR_SIGNATURE_VALIDATION && process.env.TREEZOR_SIGNATURE_VALIDATION === 'false')
            return body;
        const signature = this.treezorApi.computePayloadSignature(body.objectPayload);
        if (signature !== body.objectPayloadSignature) {
            throw new common_1.BadRequestException('Webhook payload has Incorrect signature');
        }
        return body;
    }
};
TreezorSignatureValidationPipe = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [treezor_api_1.TreezorAPI])
], TreezorSignatureValidationPipe);
exports.TreezorSignatureValidationPipe = TreezorSignatureValidationPipe;
let CamelCaseifyPayloadPipe = class CamelCaseifyPayloadPipe {
    transform(body) {
        const camelCaseData = {};
        Object.keys(body).forEach(k => {
            const key = k.replace(/([-_][a-z])/ig, ($1) => {
                return $1.toUpperCase()
                    .replace('-', '')
                    .replace('_', '');
            });
            camelCaseData[key] = body[k];
        });
        return camelCaseData;
    }
};
CamelCaseifyPayloadPipe = __decorate([
    common_1.Injectable()
], CamelCaseifyPayloadPipe);
exports.CamelCaseifyPayloadPipe = CamelCaseifyPayloadPipe;
let SaveTreezorWebhookPipe = class SaveTreezorWebhookPipe {
    constructor(webhookRepository) {
        this.webhookRepository = webhookRepository;
    }
    transform(body) {
        this.webhookRepository.save(body);
        return body;
    }
};
SaveTreezorWebhookPipe = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(webhook_entity_1.Webhook)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SaveTreezorWebhookPipe);
exports.SaveTreezorWebhookPipe = SaveTreezorWebhookPipe;
//# sourceMappingURL=treezor.pipe.js.map