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
const address_entity_1 = require("./address.entity");
const contact_entity_1 = require("./contact.entity");
const partner_entity_1 = require("./partner.entity");
const user_entity_1 = require("./user.entity");
const base_entity_1 = require("./base.entity");
const encrypt_value_transformer_1 = require("../value-transformer/encrypt.value-transformer");
var CompanyStatus;
(function (CompanyStatus) {
    CompanyStatus["SELF"] = "SELF";
    CompanyStatus["ALREADY"] = "ALREADY";
    CompanyStatus["EXIST"] = "EXIST";
    CompanyStatus["UNKNOWN"] = "UNKNOWN";
})(CompanyStatus = exports.CompanyStatus || (exports.CompanyStatus = {}));
var CompanyKycStatus;
(function (CompanyKycStatus) {
    CompanyKycStatus["PENDING"] = "PENDING";
    CompanyKycStatus["VALIDATED"] = "VALIDATED";
    CompanyKycStatus["REFUSED"] = "REFUSED";
})(CompanyKycStatus = exports.CompanyKycStatus || (exports.CompanyKycStatus = {}));
var CompanyKycLevel;
(function (CompanyKycLevel) {
    CompanyKycLevel["LIGHT"] = "LIGHT";
    CompanyKycLevel["REGULAR"] = "REGULAR";
    CompanyKycLevel["REFUSED"] = "REFUSED";
})(CompanyKycLevel = exports.CompanyKycLevel || (exports.CompanyKycLevel = {}));
var CompanySource;
(function (CompanySource) {
    CompanySource["ORIGINAL"] = "ORIGINAL";
    CompanySource["MANUAL"] = "MANUAL";
})(CompanySource = exports.CompanySource || (exports.CompanySource = {}));
var CompanyCategory;
(function (CompanyCategory) {
    CompanyCategory["PME"] = "PME";
    CompanyCategory["ETI"] = "ETI";
    CompanyCategory["GE"] = "GE";
})(CompanyCategory = exports.CompanyCategory || (exports.CompanyCategory = {}));
var CompanyProvisionningStrategies;
(function (CompanyProvisionningStrategies) {
    CompanyProvisionningStrategies["TOPUP"] = "TOPUP";
    CompanyProvisionningStrategies["AUTOLOAD"] = "AUTOLOAD";
})(CompanyProvisionningStrategies = exports.CompanyProvisionningStrategies || (exports.CompanyProvisionningStrategies = {}));
let Company = class Company extends base_entity_1.Base {
    constructor() {
        super(...arguments);
        this.status = CompanyStatus.UNKNOWN;
    }
    set treezorKycLevel(kycLevel) {
        switch (kycLevel) {
            case '1':
                this.kycLevel = CompanyKycLevel.LIGHT;
                break;
            case '2':
                this.kycLevel = CompanyKycLevel.REGULAR;
                break;
            case '4':
                this.kycLevel = CompanyKycLevel.REFUSED;
                break;
            default:
                break;
        }
    }
};
__decorate([
    typeorm_1.Column({ nullable: true, unique: true, length: 9 }),
    __metadata("design:type", String)
], Company.prototype, "siren", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, length: 14 }),
    __metadata("design:type", String)
], Company.prototype, "siret", void 0);
__decorate([
    typeorm_1.Column({
        nullable: true,
        type: 'simple-enum',
        enum: CompanySource,
        default: CompanySource.ORIGINAL,
    }),
    __metadata("design:type", String)
], Company.prototype, "source", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "brandName", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "vatNumber", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Company.prototype, "templatePreference", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "logoUrl", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "naf", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "nafNorm", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "numberEmployees", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Date)
], Company.prototype, "incorporationAt", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "legalForm", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: 'simple-enum', enum: CompanyCategory }),
    __metadata("design:type", String)
], Company.prototype, "category", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "slogan", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "domainName", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Company.prototype, "capital", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "legalAnnualTurnOver", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "legalNetIncomeRange", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, transformer: encrypt_value_transformer_1.encrypt }),
    __metadata("design:type", String)
], Company.prototype, "phone", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "treezorEmail", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Company.prototype, "treezorUserId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Company.prototype, "treezorWalletId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "treezorIban", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "treezorBic", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, default: false }),
    __metadata("design:type", Boolean)
], Company.prototype, "isFreezed", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "libeoEmail", void 0);
__decorate([
    typeorm_1.OneToMany(type => address_entity_1.Address, address => address.company, { cascade: true }),
    __metadata("design:type", Array)
], Company.prototype, "addresses", void 0);
__decorate([
    typeorm_1.OneToMany(type => contact_entity_1.Contact, contact => contact.company, { cascade: true }),
    __metadata("design:type", Array)
], Company.prototype, "contacts", void 0);
__decorate([
    typeorm_1.OneToMany(type => partner_entity_1.Partner, partner => partner.companyPartner),
    __metadata("design:type", Array)
], Company.prototype, "partners", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], Company.prototype, "claimer", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: 'simple-enum', enum: CompanyKycStatus }),
    __metadata("design:type", String)
], Company.prototype, "kycStatus", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: 'simple-enum', enum: CompanyKycLevel }),
    __metadata("design:type", String)
], Company.prototype, "kycLevel", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "kycComment", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "kycStep", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: 'simple-json' }),
    __metadata("design:type", Object)
], Company.prototype, "signature", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, type: 'simple-enum', enum: CompanyProvisionningStrategies, default: CompanyProvisionningStrategies.TOPUP }),
    __metadata("design:type", String)
], Company.prototype, "provisionningStrategy", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Company.prototype, "sddeRefusedCount", void 0);
Company = __decorate([
    typeorm_1.Entity()
], Company);
exports.Company = Company;
//# sourceMappingURL=company.entity.js.map