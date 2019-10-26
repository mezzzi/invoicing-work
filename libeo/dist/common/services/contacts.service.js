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
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contact_entity_1 = require("../entities/contact.entity");
const company_entity_1 = require("../entities/company.entity");
const emails_service_1 = require("./emails.service");
let ContactsService = class ContactsService {
    constructor(contactRepository, companyRepository, emailsService) {
        this.contactRepository = contactRepository;
        this.companyRepository = companyRepository;
        this.emailsService = emailsService;
    }
    createContact(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let emails = [];
            if (data.emails) {
                emails = data.emails.map(obj => {
                    return {
                        email: obj.email,
                        visibleOnlyCompany: user.currentCompany.id,
                        data,
                    };
                });
            }
            const contact = this.contactRepository.create({
                firstname: data.firstname,
                lastname: data.lastname,
                emails,
            });
            if (data.companyId) {
                const company = yield this.companyRepository.findOne({ id: data.companyId });
                if (!company) {
                    throw new common_1.HttpException('api.error.company.not_found', common_1.HttpStatus.BAD_REQUEST);
                }
                contact.visibleOnlyCompany = user.currentCompany.id;
                contact.company = company;
            }
            else {
                contact.user = user;
                contact.company = user.currentCompany;
            }
            yield this.contactRepository.save(contact);
            return contact;
        });
    }
    updateContact(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let contact = yield this.contactRepository.findOne({ id });
            if (!contact) {
                throw new common_1.HttpException('api.error.contact.not_found', common_1.HttpStatus.BAD_REQUEST);
            }
            if (data.emails) {
                yield data.emails.forEach((obj) => __awaiter(this, void 0, void 0, function* () {
                    const input = {
                        email: obj.email,
                        visibleOnlyCompany: contact.company.id,
                        contact,
                    };
                    if (obj.id) {
                        yield this.emailsService.updateEmail(obj.id, input);
                    }
                    else {
                        yield this.emailsService.createEmail(input);
                    }
                }));
            }
            delete data.emails;
            contact = this.contactRepository.merge(contact, data);
            return this.contactRepository.save(contact);
        });
    }
    findByCompany(user, company, orderBy, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            const [contacts, total] = yield this.contactRepository.findAndCount({
                where: {
                    company,
                    visibleOnlyCompany: (user && user.currentCompany) ? user.currentCompany.id : null,
                },
                take: limit,
                skip: offset,
            });
            return {
                total,
                rows: contacts,
            };
        });
    }
    findByCompanyAndIds(company, contactIds, visibleOnlyCompany) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!contactIds) {
                return [];
            }
            return this.contactRepository.find({ where: { id: typeorm_2.In(contactIds), company }, relations: ['emails'] });
        });
    }
};
ContactsService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(contact_entity_1.Contact)),
    __param(1, typeorm_1.InjectRepository(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        emails_service_1.EmailsService])
], ContactsService);
exports.ContactsService = ContactsService;
//# sourceMappingURL=contacts.service.js.map