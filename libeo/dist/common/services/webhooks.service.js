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
const crypto = require("crypto");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const webhook_entity_1 = require("../entities/webhook.entity");
let WebhooksService = class WebhooksService {
    constructor(webhookRepository) {
        this.webhookRepository = webhookRepository;
    }
    snakeToCamel(obj) {
        const data = {};
        Object.keys(obj).forEach(k => {
            const key = k.replace(/([-_][a-z])/ig, ($1) => {
                return $1.toUpperCase()
                    .replace('-', '')
                    .replace('_', '');
            });
            data[key] = obj[k];
        });
        return data;
    }
    compareSignature(data) {
        if (data.object_payload) {
            const signature = crypto
                .createHmac('sha256', process.env.TREEZOR_SECRET_KEY)
                .update(JSON.stringify(data.object_payload))
                .digest()
                .toString('base64');
            if (signature !== data.object_payload_signature) {
                throw new common_1.HttpException('Incorrect signature webhook', common_1.HttpStatus.BAD_REQUEST);
            }
        }
    }
    createWebhook(data) {
        return __awaiter(this, void 0, void 0, function* () {
            data = this.snakeToCamel(data);
            const webhook = this.webhookRepository.create(data);
            return this.webhookRepository.save(webhook);
        });
    }
    updateWebhook(where, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.DOMAIN && process.env.DOMAIN !== 'api.sandbox.libeo.io') {
                this.compareSignature(data);
            }
            data = this.snakeToCamel(data);
            let webhook = yield this.webhookRepository.findOne(where);
            if (!webhook) {
                webhook = this.webhookRepository.create(data);
            }
            else {
                webhook = Object.assign(webhook, data);
            }
            yield this.webhookRepository.save(webhook);
            return webhook;
        });
    }
};
WebhooksService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_2.InjectRepository(webhook_entity_1.Webhook)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], WebhooksService);
exports.WebhooksService = WebhooksService;
//# sourceMappingURL=webhooks.service.js.map