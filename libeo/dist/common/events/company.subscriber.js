"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const contextService = require("request-context");
const company_entity_1 = require("../entities/company.entity");
const typeorm_1 = require("typeorm");
const histories_service_1 = require("../services/histories.service");
const history_entity_1 = require("../entities/history.entity");
const histories_dto_1 = require("../dto/histories.dto");
let CompanySubscriber = class CompanySubscriber {
    listenTo() {
        return company_entity_1.Company;
    }
    afterUpdate(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.entity.kycStatus !== event.databaseEntity.kycStatus) {
                const historiesService = new histories_service_1.HistoriesService(typeorm_1.getRepository('History'));
                historiesService.createHistory({
                    user: contextService.get('request:user'),
                    params: { kycStatus: event.entity.kycStatus },
                    entity: history_entity_1.HistoryEntity.COMPANY,
                    entityId: event.databaseEntity.id,
                    event: histories_dto_1.HistoryEvent.UPDATE_KYC_STATUS,
                });
            }
        });
    }
};
CompanySubscriber = __decorate([
    typeorm_1.EventSubscriber()
], CompanySubscriber);
exports.CompanySubscriber = CompanySubscriber;
//# sourceMappingURL=company.subscriber.js.map