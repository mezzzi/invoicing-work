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
const mailjet = require("node-mailjet");
const common_1 = require("@nestjs/common");
const nestjs_config_1 = require("nestjs-config");
let EmailService = class EmailService {
    constructor(configService, logger) {
        this.logger = logger;
        const config = configService.get('mailjet');
        this.mailer = mailjet.connect(config.MAILJET_APIKEY, config.MAILJET_SECRETKEY);
    }
    send(messagesDetail) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.NODE_ENV === 'test')
                return;
            const messages = messagesDetail.map(message => {
                const From = message.From ? message.From : {
                    Email: 'lucas@libeo.io',
                    Name: 'Service Client Libeo',
                };
                const TemplateLanguage = message.TemplateLanguage !== undefined ? message.TemplateLanguage : true;
                return Object.assign({}, message, { From, TemplateErrorReporting: {
                        Email: 'tech@libeo.io',
                        Name: 'Mailjet - TemplateErrorReporting'
                    }, TemplateLanguage });
            });
            try {
                yield this.mailer
                    .post('send', { version: 'v3.1' })
                    .request({
                    Messages: messages
                });
            }
            catch (err) {
                this.logger.error(err.message);
                throw new common_1.HttpException('api.error.user.mailjet', err.statusCode);
            }
        });
    }
};
EmailService = __decorate([
    __param(0, nestjs_config_1.InjectConfig()),
    __metadata("design:paramtypes", [nestjs_config_1.ConfigService,
        common_1.Logger])
], EmailService);
exports.EmailService = EmailService;
//# sourceMappingURL=email.service.js.map