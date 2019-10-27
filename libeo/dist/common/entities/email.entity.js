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
const contact_entity_1 = require("./contact.entity");
const encrypt_value_transformer_1 = require("../value-transformer/encrypt.value-transformer");
const lowercase_value_transformer_1 = require("../value-transformer/lowercase.value-transformer");
let Email = class Email extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Email.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ transformer: [lowercase_value_transformer_1.lowercase, encrypt_value_transformer_1.encrypt], length: 80 }),
    __metadata("design:type", String)
], Email.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Email.prototype, "visibleOnlyCompany", void 0);
__decorate([
    typeorm_1.ManyToOne(type => contact_entity_1.Contact, contact => contact.emails),
    __metadata("design:type", contact_entity_1.Contact)
], Email.prototype, "contact", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Email.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Email.prototype, "updatedAt", void 0);
Email = __decorate([
    typeorm_1.Entity()
], Email);
exports.Email = Email;
//# sourceMappingURL=email.entity.js.map