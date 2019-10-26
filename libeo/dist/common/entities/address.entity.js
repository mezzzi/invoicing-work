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
const company_entity_1 = require("./company.entity");
const class_validator_1 = require("class-validator");
let Address = class Address extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Address.prototype, "id", void 0);
__decorate([
    class_validator_1.Length(14),
    typeorm_1.Column({ nullable: true, length: 14 }),
    __metadata("design:type", String)
], Address.prototype, "siret", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Address.prototype, "address1", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Address.prototype, "address2", void 0);
__decorate([
    class_validator_1.IsInt(),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Address.prototype, "zipcode", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Address.prototype, "city", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Address.prototype, "country", void 0);
__decorate([
    typeorm_1.ManyToOne(type => company_entity_1.Company, company => company.addresses),
    __metadata("design:type", company_entity_1.Company)
], Address.prototype, "company", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Address.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Address.prototype, "updatedAt", void 0);
Address = __decorate([
    typeorm_1.Entity()
], Address);
exports.Address = Address;
//# sourceMappingURL=address.entity.js.map