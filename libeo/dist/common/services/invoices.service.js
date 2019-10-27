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
const uuid = require("uuid");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invoice_entity_1 = require("../entities/invoice.entity");
const companies_service_1 = require("./companies.service");
const company_entity_1 = require("../entities/company.entity");
const ocr_service_1 = require("../../ocr/ocr.service");
const partners_service_1 = require("./partners.service");
const ibans_service_1 = require("./ibans.service");
const email_service_1 = require("../../notification/email.service");
const payment_entity_1 = require("../entities/payment.entity");
const invoice_storage_service_1 = require("../../storage/invoice-storage.service");
const rib_storage_service_1 = require("../../storage/rib-storage.service");
const zendesk_service_1 = require("../../notification/zendesk.service");
const zendesk_ticket_interface_1 = require("../../notification/interface/zendesk-ticket.interface");
let InvoicesService = class InvoicesService {
    constructor(invoiceRepository, paymentsRepository, companiesService, partnersService, ibansService, emailService, invoiceStorageService, ribStorageService, zendeskService) {
        this.invoiceRepository = invoiceRepository;
        this.paymentsRepository = paymentsRepository;
        this.companiesService = companiesService;
        this.partnersService = partnersService;
        this.ibansService = ibansService;
        this.emailService = emailService;
        this.invoiceStorageService = invoiceStorageService;
        this.ribStorageService = ribStorageService;
        this.zendeskService = zendeskService;
    }
    extractIban(str) {
        const ibanRegex = /([A-Z]{2}[ \-]?[0-9]{2})(?=(?:[ \-]?[A-Z0-9]){9,30}$)((?:[ \-]?[A-Z0-9]{3,5}){2,7})([ \-]?[A-Z0-9]{1,3})?/gm;
        const m = ibanRegex.exec(str);
        if (m !== null) {
            const iban = m[0].replace(/\s/g, '');
            if (iban.length >= 14) {
                return iban;
            }
        }
        return null;
    }
    importingInvoice(invoice, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fileLocation } = yield this.invoiceStorageService.upload(file, invoice.companyReceiver.id);
                invoice.status = invoice_entity_1.InvoiceStatus.IMPORTED;
                invoice.filepath = fileLocation;
                invoice.importAt = new Date();
                yield invoice.save();
                yield this.scanningInvoice(invoice, fileLocation);
            }
            catch (err) {
                if (invoice.status !== invoice_entity_1.InvoiceStatus.SCANNED) {
                    invoice.status = invoice_entity_1.InvoiceStatus.IMPORTED;
                }
                invoice.error = true;
                invoice.save();
                throw new Error(err);
            }
        });
    }
    parseOcrInvoice(invoice, body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!body || body.length === 0) {
                return invoice;
            }
            const [extract, raw] = body;
            invoice.ocrFeedback = { extract, raw };
            invoice.currency = extract.currency || null;
            invoice.total = extract.total || null;
            invoice.totalWoT = extract.totalWoT || null;
            invoice.invoiceDate = (extract.time) ? new Date(extract.time) : null;
            invoice.vatAmounts = extract.taxes || null;
            if (extract.vendorDatas) {
                const vendorDatas = extract.vendorDatas;
                if (vendorDatas.siren || vendorDatas.siret) {
                    const result = yield this.companiesService.searchCompanies(vendorDatas.siren || vendorDatas.siret);
                    if (result.total > 0) {
                        invoice.ocrSirenFeedback = result.rows[0];
                    }
                }
                else if (vendorDatas.name) {
                    const result = yield this.companiesService.searchCompanies(vendorDatas.name);
                    if (result.total > 0) {
                        invoice.ocrSirenFeedback = result.rows[0];
                    }
                    else {
                        invoice.ocrSirenFeedback = { name: vendorDatas.name };
                    }
                }
            }
            if (raw && raw.pages && raw.pages.length > 0) {
                raw.pages.forEach((page) => {
                    page.chunks.forEach((chunk) => {
                        const tmpIban = this.extractIban(chunk.text);
                        if (tmpIban) {
                            invoice.ocrFeedback.iban = tmpIban;
                        }
                    });
                });
            }
            return invoice;
        });
    }
    scanningInvoice(invoice, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            invoice.status = invoice_entity_1.InvoiceStatus.SCANNING;
            yield invoice.save();
            const type = 'jenji';
            const ocr = new ocr_service_1.OcrService(type, {
                baseUrl: process.env.OCR_API_URL,
                username: process.env.OCR_USERNAME,
                apiKey: process.env.OCR_API_KEY,
            });
            try {
                yield ocr.loadFile(filePath);
            }
            catch (err) {
                throw new Error(err);
            }
            try {
                const body = yield ocr.getData();
                invoice.status = invoice_entity_1.InvoiceStatus.SCANNED;
                invoice.ocrPartner = type;
                invoice.ocrStatus = 'ok';
                invoice = yield this.parseOcrInvoice(invoice, body);
                yield invoice.save();
            }
            catch (err) {
                invoice.status = invoice_entity_1.InvoiceStatus.SCANNED;
                invoice.error = true;
                invoice.ocrPartner = type;
                invoice.ocrFeedback = err.message;
                invoice.ocrStatus = 'error';
                yield invoice.save();
                throw new common_1.HttpException(err.message, err.statusCode);
            }
        });
    }
    uploadRib(file, invoiceId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!invoiceId) {
                throw new common_1.BadRequestException('api.error.invoice.missing');
            }
            const invoice = yield this.invoiceRepository.findOne({ where: { id: invoiceId } });
            if (!invoice) {
                throw new common_1.NotFoundException('api.error.invoice.not_found');
            }
            try {
                const { fileLocation } = yield this.ribStorageService.upload(file, invoice.companyEmitter.id);
                const claimer = yield this.companiesService.getClaimer(invoice.companyReceiver.id);
                this.zendeskService.createTicket({
                    type: zendesk_ticket_interface_1.ZendeskTicketType.TASK,
                    priority: zendesk_ticket_interface_1.ZendesTicketPriority.URGENT,
                    requester: { name: claimer.fullName, email: claimer.email },
                    subject: 'Vérification manuelle RIB',
                    comment: { body: `L'entreprise ${invoice.companyEmitter.name || invoice.companyEmitter.brandName} a changé son IBAN pour recevoir le paiement de sa facture. Son RIB doit être vérifié manuellement.` },
                });
                return fileLocation;
            }
            catch (err) {
                throw new common_1.HttpException(err.message, err.statusCode);
            }
        });
    }
    createInvoice(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = data.file ? yield data.file : null;
            const invoice = this.invoiceRepository.create();
            invoice.status = invoice_entity_1.InvoiceStatus.IMPORTING;
            invoice.companyReceiver = yield this.companiesService.getCurrentCompanyByUser(user);
            invoice.importedBy = user;
            invoice.filename = file ? file.filename : null;
            yield this.invoiceRepository.save(invoice);
            if (data.file) {
                try {
                    yield this.importingInvoice(invoice, file);
                }
                catch (err) {
                    throw new common_1.HttpException(err.message, err.statusCode);
                }
            }
            return invoice;
        });
    }
    createOrUpdateAR(user, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const companyEmitter = yield this.companiesService.getCurrentCompanyByUser(user);
            data.companyEmitter = companyEmitter;
            data.emitterId = user.id;
            if (data.companyEmitterDetails) {
                data.companyEmitterDetails.iban =
                    companyEmitter && companyEmitter.treezorIban;
            }
            if (!data.companyReceiverDetails && !data.companyReceiverDetails.siren) {
                throw new common_1.HttpException('api.error.company.siren', common_1.HttpStatus.BAD_REQUEST);
            }
            const companyReceiver = yield this.companiesService.findOneBySiren(data.companyReceiverDetails.siren);
            if (companyReceiver) {
                data.companyReceiver = companyReceiver;
                data.companyReceiverId = companyReceiver.id;
            }
            if (data.companyReceiverDetails) {
                data.companyReceiverDetails.iban =
                    companyReceiver && companyReceiver.treezorIban;
            }
            let invoice;
            if (id) {
                invoice = yield this.invoiceRepository.findOne({
                    id,
                });
                if (!invoice) {
                    throw new common_1.HttpException('api.error.invoice.not_found', common_1.HttpStatus.NOT_FOUND);
                }
                if (!data.companyReceiver) {
                    delete invoice.companyReceiver;
                }
                this.invoiceRepository.merge(invoice, data);
            }
            else {
                invoice = yield this.invoiceRepository.create();
                this.invoiceRepository.merge(invoice, data);
                if (!data.companyReceiver) {
                    delete invoice.companyReceiver;
                }
                invoice.status = invoice_entity_1.InvoiceStatus.AR_DRAFT;
            }
            invoice = yield this.invoiceRepository.save(invoice);
            return invoice;
        });
    }
    updateStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = yield this.invoiceRepository.findOne({ id });
            if (!invoice) {
                throw new common_1.HttpException('api.error.invoice.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            invoice.status = status;
            yield invoice.save();
            return invoice;
        });
    }
    updateInvoice(user, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let invoice = yield this.invoiceRepository.findOne({
                id,
                companyReceiver: user.currentCompany,
            });
            if (!invoice) {
                throw new common_1.HttpException('api.error.invoice.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            if (data.companyEmitter) {
                if (!data.companyEmitter.siren) {
                    throw new common_1.HttpException('api.error.company.siren', common_1.HttpStatus.BAD_REQUEST);
                }
                let companyEmitter = yield this.companiesService.findOneBySiren(data.companyEmitter.siren);
                if (!companyEmitter) {
                    companyEmitter = yield this.companiesService.createOrUpdateCompany(user, data.companyEmitter);
                }
                data.companyEmitter = companyEmitter;
                invoice.status = invoice_entity_1.InvoiceStatus.TO_PAY;
            }
            else {
                delete invoice.companyEmitter;
            }
            const { iban } = data;
            delete data.iban;
            this.invoiceRepository.merge(invoice, data);
            if (iban) {
                const alreadyIban = yield this.ibansService.findOneByIbanAndCompany(iban, invoice.companyEmitter);
                invoice.iban = alreadyIban;
                if (!alreadyIban) {
                    try {
                        const res = yield this.ibansService.getApiValidateIban(iban);
                        res.iban = iban;
                        invoice.iban = yield this.ibansService.createIban(res, invoice, user);
                    }
                    catch (err) {
                        throw new common_1.HttpException('api.error.iban.check', err.statusCode);
                    }
                }
            }
            else {
                invoice.iban = iban;
            }
            if (data.companyEmitter) {
                yield this.partnersService.createPartner(user, data.companyEmitter);
            }
            invoice = yield this.invoiceRepository.save(invoice);
            return invoice;
        });
    }
    findByCompany(company, filters, orderBy, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            if (filters.status) {
                filters.status = typeorm_2.In(filters.status);
            }
            const whereClause = Object.assign({ companyReceiver: company }, filters);
            const [invoices, total] = yield this.invoiceRepository.findAndCount({
                where: whereClause,
                order: {
                    createdAt: 'DESC',
                },
                take: limit,
                skip: offset,
            });
            return {
                total,
                rows: invoices,
            };
        });
    }
    findByEmitterCompany(company, filters, orderBy, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            if (filters.status) {
                filters.status = typeorm_2.In(filters.status);
            }
            const whereClause = Object.assign({ companyEmitter: company, enabled: true }, filters);
            const [invoices, total] = yield this.invoiceRepository.findAndCount({
                where: whereClause,
                order: {
                    createdAt: 'DESC',
                },
                take: limit,
                skip: offset,
            });
            return {
                total,
                rows: invoices,
            };
        });
    }
    findOneByIdAndCurrentCompany(id, currentCompany) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = yield this.invoiceRepository.findOne({
                id,
                companyReceiver: currentCompany,
            });
            if (!invoice) {
                throw new common_1.HttpException('api.error.invoice.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            return invoice;
        });
    }
    findOneByIdAndEmitterCompany(id, currentCompany) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = yield this.invoiceRepository.findOne({
                id,
                companyEmitter: currentCompany,
                enabled: true,
            });
            if (!invoice) {
                throw new common_1.HttpException('api.error.invoice.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            return invoice;
        });
    }
    findOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = yield this.invoiceRepository.findOne({
                id,
            });
            if (!invoice) {
                throw new common_1.HttpException('api.error.invoice.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            return invoice;
        });
    }
    removeInvoice(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = yield this.invoiceRepository.findOne({
                id,
                companyReceiver: user.currentCompany,
            });
            if (!invoice) {
                throw new common_1.HttpException('api.error.invoice.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            invoice.enabled = false;
            yield invoice.save();
            return invoice;
        });
    }
    removeAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const invoices = yield this.invoiceRepository.find({});
            invoices.forEach(invoice => {
                invoice.enabled = false;
            });
            yield this.invoiceRepository.save(invoices);
            return true;
        });
    }
    generateCode(user, invoiceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = yield this.findOneByIdAndCurrentCompany(invoiceId, user.currentCompany);
            if (invoice.status !== invoice_entity_1.InvoiceStatus.TO_PAY) {
                throw new common_1.HttpException('api.error.invoice.invalid_status', common_1.HttpStatus.BAD_REQUEST);
            }
            invoice.code = uuid
                .v4()
                .replace('-', '')
                .slice(0, 6);
            yield invoice.save();
            const message = {
                To: [
                    {
                        Email: user.email,
                        Name: user.fullName,
                    },
                ],
                TemplateID: 705867,
                Subject: 'Validez votre paiement',
                Variables: {
                    invoiceNumber: invoice.number || '',
                    totalWithVat: invoice.total
                        ? `${invoice.total} ${invoice.currency}`
                        : `0 ${invoice.currency}`,
                    paymentValidationCode: invoice.code,
                },
            };
            yield this.emailService.send([message]);
            return invoice;
        });
    }
    checkCode(invoiceId, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = yield this.invoiceRepository.findOne({
                id: invoiceId,
                code,
            });
            if (!invoice) {
                throw new common_1.HttpException('api.error.invoice.invalid_code', common_1.HttpStatus.BAD_REQUEST);
            }
            return invoice;
        });
    }
    invoicesSent(myCompany, targetCompany) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                companyEmitter: myCompany,
            };
            if (myCompany !== targetCompany) {
                options.companyReceiver = targetCompany;
            }
            return this.invoiceRepository.count(options);
        });
    }
    invoicesReceived(myCompany, targetCompany) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                companyReceiver: myCompany,
            };
            if (myCompany !== targetCompany) {
                options.companyEmitter = targetCompany;
            }
            return this.invoiceRepository.count(options);
        });
    }
    findEstimatedBalance(invoice) {
        return __awaiter(this, void 0, void 0, function* () {
            if (invoice.companyReceiver.provisionningStrategy === company_entity_1.CompanyProvisionningStrategies.AUTOLOAD) {
                return null;
            }
            if (invoice.status !== invoice_entity_1.InvoiceStatus.PLANNED) {
                return null;
            }
            const payments = yield this.paymentsRepository.findOne({ where: { invoice, status: typeorm_2.Not(payment_entity_1.PaymentStatus.CANCELLED) } });
            if (payments) {
                return payments.libeoEstimatedBalance;
            }
            return null;
        });
    }
    findPaymentAt(invoice) {
        return __awaiter(this, void 0, void 0, function* () {
            if (invoice.companyReceiver.provisionningStrategy === company_entity_1.CompanyProvisionningStrategies.AUTOLOAD) {
                return null;
            }
            if (invoice.status !== invoice_entity_1.InvoiceStatus.PLANNED) {
                return null;
            }
            const payments = yield this.paymentsRepository.findOne({ where: { invoice, status: typeorm_2.Not(payment_entity_1.PaymentStatus.CANCELLED) } });
            if (payments) {
                return payments.paymentAt;
            }
            return null;
        });
    }
};
InvoicesService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(invoice_entity_1.Invoice)),
    __param(1, typeorm_1.InjectRepository(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        companies_service_1.CompaniesService,
        partners_service_1.PartnersService,
        ibans_service_1.IbansService,
        email_service_1.EmailService,
        invoice_storage_service_1.InvoiceStorageService,
        rib_storage_service_1.RibStorageService,
        zendesk_service_1.ZendeskService])
], InvoicesService);
exports.InvoicesService = InvoicesService;
//# sourceMappingURL=invoices.service.js.map