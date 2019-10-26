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
const shortid = require("shortid");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invoice_entity_1 = require("../entities/invoice.entity");
const companies_service_1 = require("./companies.service");
const ocr_service_1 = require("../../ocr/ocr.service");
const files_service_1 = require("./files.service");
const partners_service_1 = require("./partners.service");
const ibans_service_1 = require("./ibans.service");
const email_service_1 = require("../../notification/email.service");
let InvoicesService = class InvoicesService {
    constructor(invoiceRepository, companiesService, partnersService, ibansService, emailService) {
        this.invoiceRepository = invoiceRepository;
        this.companiesService = companiesService;
        this.partnersService = partnersService;
        this.ibansService = ibansService;
        this.emailService = emailService;
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
            const path = `companies/${invoice.companyReceiver.id}/invoices`;
            const fileService = new files_service_1.FileService(file, {
                dir: `${__dirname}/../../../public/static/${path}`,
            });
            try {
                const body = yield fileService.upload();
                invoice.status = invoice_entity_1.InvoiceStatus.IMPORTED;
                if (body.filePath.indexOf('http') !== -1) {
                    invoice.filepath = body.filePath;
                }
                else {
                    let baseUrl = '//localhost:9000/static/';
                    if (process.env.DOMAIN) {
                        baseUrl = `//${process.env.DOMAIN}/static/`;
                    }
                    invoice.filepath = `${baseUrl}${path}/${fileService.filename}`;
                }
                invoice.importAt = new Date();
                yield invoice.save();
                yield this.scanningInvoice(invoice, body.filePath);
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
    createInvoice(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = (data.file) ? yield data.file : null;
            const invoice = this.invoiceRepository.create();
            invoice.status = invoice_entity_1.InvoiceStatus.IMPORTING;
            invoice.companyReceiver = yield this.companiesService.getCurrentCompanyByUser(user);
            invoice.importedBy = user;
            invoice.filename = (file) ? file.filename : null;
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
            let invoice = yield this.invoiceRepository.findOne({ id, companyReceiver: user.currentCompany });
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
    findOneByIdAndCurrentCompany(id, currentCompany) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = yield this.invoiceRepository.findOne({ id, companyReceiver: currentCompany });
            if (!invoice) {
                throw new common_1.HttpException('api.error.invoice.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            return invoice;
        });
    }
    removeInvoice(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = yield this.invoiceRepository.findOne({ id, companyReceiver: user.currentCompany });
            if (!invoice) {
                throw new common_1.HttpException('api.error.invoice.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            invoice.enabled = false;
            yield invoice.save();
            return invoice;
        });
    }
    generateCode(user, invoiceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = yield this.findOneByIdAndCurrentCompany(invoiceId, user.currentCompany);
            if (invoice.status !== invoice_entity_1.InvoiceStatus.TO_PAY) {
                throw new common_1.HttpException('api.error.invoice.invalid_status', common_1.HttpStatus.BAD_REQUEST);
            }
            invoice.code = shortid.generate();
            yield invoice.save();
            const message = {
                To: [{
                        Email: user.email,
                        Name: user.fullName,
                    }],
                TemplateID: 705867,
                Subject: 'Validez votre paiement',
                Variables: {
                    invoiceNumber: invoice.number || '',
                    totalWithVat: (invoice.total) ? `${invoice.total} ${invoice.currency}` : `0 ${invoice.currency}`,
                    paymentValidationCode: invoice.code,
                },
            };
            yield this.emailService.send([message]);
            return invoice;
        });
    }
    checkCode(invoiceId, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = yield this.invoiceRepository.findOne({ id: invoiceId, code });
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
};
InvoicesService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(invoice_entity_1.Invoice)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        companies_service_1.CompaniesService,
        partners_service_1.PartnersService,
        ibans_service_1.IbansService,
        email_service_1.EmailService])
], InvoicesService);
exports.InvoicesService = InvoicesService;
//# sourceMappingURL=invoices.service.js.map