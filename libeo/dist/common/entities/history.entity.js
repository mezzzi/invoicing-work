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
const histories_dto_1 = require("../dto/histories.dto");
var HistoryEntity;
(function (HistoryEntity) {
    HistoryEntity["ADDRESS"] = "ADDRESS";
    HistoryEntity["COMPANY"] = "COMPANY";
    HistoryEntity["CONTACT"] = "CONTACT";
    HistoryEntity["EMAIL"] = "EMAIL";
    HistoryEntity["INVOICE"] = "INVOICE";
    HistoryEntity["PARTNER"] = "PARTNER";
    HistoryEntity["USER"] = "USER";
    HistoryEntity["PAYMENT"] = "PAYMENT";
})(HistoryEntity = exports.HistoryEntity || (exports.HistoryEntity = {}));
let History = class History extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], History.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        type: 'simple-enum',
        enum: HistoryEntity,
        nullable: true,
    }),
    __metadata("design:type", String)
], History.prototype, "entity", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], History.prototype, "entityId", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], History.prototype, "event", void 0);
__decorate([
    typeorm_1.Column({
        type: 'simple-json',
        nullable: true,
    }),
    __metadata("design:type", Object)
], History.prototype, "params", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_entity_1.User, { nullable: true, eager: true }),
    __metadata("design:type", user_entity_1.User)
], History.prototype, "user", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], History.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], History.prototype, "updatedAt", void 0);
History = __decorate([
    typeorm_1.Entity()
], History);
exports.History = History;
//# sourceMappingURL=history.entity.js.map