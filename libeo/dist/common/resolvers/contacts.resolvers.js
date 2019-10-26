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
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const contacts_dto_1 = require("../dto/contacts.dto");
const contacts_service_1 = require("../services/contacts.service");
const emails_service_1 = require("../services/emails.service");
const contact_entity_1 = require("../entities/contact.entity");
let ContactsResolvers = class ContactsResolvers {
    constructor(contactsService, emailsService) {
        this.contactsService = contactsService;
        this.emailsService = emailsService;
    }
    createContact(ctx, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.contactsService.createContact(ctx.req.user, input);
        });
    }
    updateContact(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.contactsService.updateContact(id, input);
        });
    }
    emails(contact) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emailsService.findByContact(contact);
        });
    }
};
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, contacts_dto_1.CreateContactDto]),
    __metadata("design:returntype", Promise)
], ContactsResolvers.prototype, "createContact", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Args('id')), __param(1, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, contacts_dto_1.UpdateContactDto]),
    __metadata("design:returntype", Promise)
], ContactsResolvers.prototype, "updateContact", null);
__decorate([
    graphql_1.ResolveProperty(),
    __param(0, graphql_1.Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [contact_entity_1.Contact]),
    __metadata("design:returntype", Promise)
], ContactsResolvers.prototype, "emails", null);
ContactsResolvers = __decorate([
    graphql_1.Resolver('Contact'),
    __metadata("design:paramtypes", [contacts_service_1.ContactsService,
        emails_service_1.EmailsService])
], ContactsResolvers);
exports.ContactsResolvers = ContactsResolvers;
//# sourceMappingURL=contacts.resolvers.js.map