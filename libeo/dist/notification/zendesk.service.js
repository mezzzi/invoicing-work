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
const Zendesk = require("zendesk-node-api");
const nestjs_config_1 = require("nestjs-config");
let ZendeskService = class ZendeskService {
    constructor(configService) {
        const config = configService.get('zendesk');
        this.zendeskClient = new Zendesk({
            url: config.ZENDESK_API_URL,
            email: config.ZENDESK_API_EMAIL,
            token: config.ZENDESK_API_TOKEN
        });
        this.environmentZendesk = config.ZENDESK_ENVIRONMENT;
    }
    createTicket(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.environmentZendesk.value === 'Test') {
                return;
            }
            try {
                let customFields = [this.environmentZendesk];
                if (obj.customFields) {
                    customFields = [...customFields, ...obj.customFields];
                }
                yield this.zendeskClient
                    .tickets.create({
                    type: obj.type || null,
                    priority: obj.priority,
                    requester: { name: obj.requester.name, email: obj.requester.email },
                    subject: obj.subject,
                    comment: obj.comment,
                    custom_fields: customFields,
                });
            }
            catch (err) {
                throw new Error(err);
            }
        });
    }
};
ZendeskService = __decorate([
    __param(0, nestjs_config_1.InjectConfig()),
    __metadata("design:paramtypes", [nestjs_config_1.ConfigService])
], ZendeskService);
exports.ZendeskService = ZendeskService;
//# sourceMappingURL=zendesk.service.js.map