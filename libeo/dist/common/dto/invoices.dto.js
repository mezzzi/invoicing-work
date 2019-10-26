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
const company_entity_1 = require("../entities/company.entity");
const class_validator_1 = require("class-validator");
class CreateInvoiceDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Object)
], CreateInvoiceDto.prototype, "file", void 0);
exports.CreateInvoiceDto = CreateInvoiceDto;
class UpdateInvoiceDto {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "receiverTitle", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "number", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.IsCurrency(),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "currency", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], UpdateInvoiceDto.prototype, "total", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsNumber(),
    __metadata("design:type", Number)
], UpdateInvoiceDto.prototype, "totalWoT", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsDate(),
    __metadata("design:type", Date)
], UpdateInvoiceDto.prototype, "dueDate", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsDate(),
    __metadata("design:type", Date)
], UpdateInvoiceDto.prototype, "invoiceDate", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", company_entity_1.Company)
], UpdateInvoiceDto.prototype, "companyEmitter", void 0);
exports.UpdateInvoiceDto = UpdateInvoiceDto;
//# sourceMappingURL=invoices.dto.js.map