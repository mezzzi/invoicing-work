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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const company_entity_1 = require("./company.entity");
const email_entity_1 = require("./email.entity");
const encrypt_value_transformer_1 = require("../value-transformer/encrypt.value-transformer");
let Contact = class Contact extends typeorm_1.BaseEntity {
    get fullName() {
        return `${this.firstname} ${this.lastname}`;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Contact.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ transformer: encrypt_value_transformer_1.encrypt, nullable: true, length: 50 }),
    __metadata("design:type", String)
], Contact.prototype, "firstname", void 0);
__decorate([
    typeorm_1.Column({ transformer: encrypt_value_transformer_1.encrypt, nullable: true, length: 50 }),
    __metadata("design:type", String)
], Contact.prototype, "lastname", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_entity_1.User, user => user.contacts, { eager: true }),
    __metadata("design:type", user_entity_1.User)
], Contact.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(type => company_entity_1.Company, company => company.contacts, { eager: true }),
    __metadata("design:type", company_entity_1.Company)
], Contact.prototype, "company", void 0);
__decorate([
    typeorm_1.OneToMany(type => email_entity_1.Email, email => email.contact, { cascade: true }),
    __metadata("design:type", Array)
], Contact.prototype, "emails", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Contact.prototype, "visibleOnlyCompany", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Contact.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Contact.prototype, "updatedAt", void 0);
Contact = __decorate([
    typeorm_1.Entity()
], Contact);
exports.Contact = Contact;
//# sourceMappingURL=contact.entity.js.map