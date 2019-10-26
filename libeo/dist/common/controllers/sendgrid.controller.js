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
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("@nestjs/typeorm");
const inbound_email_dto_1 = require("../dto/inbound_email.dto");
const invoices_service_1 = require("../services/invoices.service");
const users_service_1 = require("../services/users.service");
const webhooks_service_1 = require("../services/webhooks.service");
const companies_service_1 = require("../services/companies.service");
const payments_service_1 = require("../services/payments.service");
const company_entity_1 = require("../entities/company.entity");
const payment_repository_1 = require("../repositories/payment.repository");
const fs = require("fs");
const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
const attachmentStatus = [];
let SendgridController = class SendgridController {
    constructor(companyRepository, paymentRepository, webhooksService, paymentsService, companiesService, invoicesService, usersService) {
        this.companyRepository = companyRepository;
        this.paymentRepository = paymentRepository;
        this.webhooksService = webhooksService;
        this.paymentsService = paymentsService;
        this.companiesService = companiesService;
        this.invoicesService = invoicesService;
        this.usersService = usersService;
    }
    newIncomingEmail(files, MyBody, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const companyLibeoEmail = MyBody.to.substring(0, MyBody.to.indexOf('@box.sandbox.libeo.io'));
            const emailSender = MyBody.from.substring(MyBody.from.indexOf('<') + 1, MyBody.from.indexOf('>'));
            let emailConfirmation = '';
            const invoiceUser = yield this.usersService.findOneByEmail(emailSender);
            const receivingCompany = yield this.companyRepository.findOne({ where: { libeoEmail: companyLibeoEmail } });
            if (receivingCompany == null) {
                emailConfirmation = 'COMPANY_NOT_FOUND';
            }
            else {
                if (files === undefined || files === 0) {
                    emailConfirmation = 'NO_ATTACHEMENT';
                }
                else {
                    let nbNotAccepted = 0;
                    files.forEach((attachment) => __awaiter(this, void 0, void 0, function* () {
                        if (acceptedTypes.indexOf(attachment.mimetype) < 0) {
                            attachmentStatus[attachment.originalname] = 'NOT_ACCEPTED';
                            nbNotAccepted += 1;
                        }
                        else {
                            attachmentStatus[attachment.originalname] = 'ACCEPTED';
                            console.log(attachment.buffer);
                            fs.writeFileSync(`${attachment.originalname}`, attachment.buffer);
                        }
                    }));
                    if (nbNotAccepted > 0) {
                        emailConfirmation = 'PARTIAL';
                    }
                    else {
                        emailConfirmation = 'SUCCESS';
                    }
                }
            }
            console.log(receivingCompany.id);
            console.log(emailConfirmation);
            console.log(attachmentStatus);
            return 'All good';
        });
    }
};
__decorate([
    common_1.Post('email'),
    __param(0, common_1.UploadedFiles()), __param(1, common_1.Body()), __param(2, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, inbound_email_dto_1.ParsedMailDto, Object]),
    __metadata("design:returntype", Promise)
], SendgridController.prototype, "newIncomingEmail", null);
SendgridController = __decorate([
    common_1.Controller('api/v1/sendgrid'),
    __param(0, typeorm_2.InjectRepository(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        payment_repository_1.PaymentRepository,
        webhooks_service_1.WebhooksService,
        payments_service_1.PaymentsService,
        companies_service_1.CompaniesService,
        invoices_service_1.InvoicesService,
        users_service_1.UsersService])
], SendgridController);
exports.SendgridController = SendgridController;
//# sourceMappingURL=sendgrid.controller.js.map