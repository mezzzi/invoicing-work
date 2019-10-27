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
const payin_entity_1 = require("../entities/payin.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
let PayinsService = class PayinsService {
    constructor(payinRepository) {
        this.payinRepository = payinRepository;
    }
    createPayin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const payin = this.payinRepository.create(data);
            yield this.payinRepository.save(payin);
            return payin;
        });
    }
    hydratePayinWithTreezor(payin, treezorPayin) {
        return __awaiter(this, void 0, void 0, function* () {
            payin.treezorWalletId = treezorPayin.walletId;
            payin.treezorPayinId = treezorPayin.payinId;
            payin.treezorCreatedAt = new Date();
            payin.treezorResponse = treezorPayin.informationStatus;
            yield payin.save();
        });
    }
};
PayinsService = __decorate([
    __param(0, typeorm_2.InjectRepository(payin_entity_1.Payin)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], PayinsService);
exports.PayinsService = PayinsService;
//# sourceMappingURL=payins.service.js.map