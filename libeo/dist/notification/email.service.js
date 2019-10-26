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
const mailjet = require("node-mailjet");
const common_1 = require("@nestjs/common");
const nestjs_config_1 = require("nestjs-config");
let EmailService = class EmailService {
    constructor(configService) {
        const config = configService.get('mailjet');
        this.mailer = mailjet.connect(config.MAILJET_APIKEY, config.MAILJET_SECRETKEY);
    }
    send(messagesDetail) {
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
        this.mailer
            .post('send', { version: 'v3.1' })
            .request({
            Messages: messages
        })
            .catch(err => {
            const logger = new common_1.Logger();
            logger.error(err.message);
            throw new common_1.HttpException('api.error.user.mailjet', err.statusCode);
        });
    }
};
EmailService = __decorate([
    __param(0, nestjs_config_1.InjectConfig()),
    __metadata("design:paramtypes", [nestjs_config_1.ConfigService])
], EmailService);
exports.EmailService = EmailService;
//# sourceMappingURL=email.service.js.map