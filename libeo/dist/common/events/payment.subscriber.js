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
const typeorm_1 = require("typeorm");
const histories_service_1 = require("../services/histories.service");
const history_entity_1 = require("../entities/history.entity");
const histories_dto_1 = require("../dto/histories.dto");
const payment_entity_1 = require("../entities/payment.entity");
const common_1 = require("@nestjs/common");
let PaymentSubscriber = class PaymentSubscriber {
    checkStatusChange(event) {
        const validatedStatuses = {};
        validatedStatuses[payment_entity_1.PaymentStatus.REQUESTED] = [payment_entity_1.PaymentStatus.BEING_PROCESSED, payment_entity_1.PaymentStatus.CANCELLED];
        validatedStatuses[payment_entity_1.PaymentStatus.BEING_PROCESSED] = [payment_entity_1.PaymentStatus.TREEZOR_PENDING, payment_entity_1.PaymentStatus.TREEZOR_SYNC_KO_NOT_ENOUGH_BALANCE, payment_entity_1.PaymentStatus.TREEZOR_SYNC_KO_MISC, payment_entity_1.PaymentStatus.CANCELLED];
        validatedStatuses[payment_entity_1.PaymentStatus.TREEZOR_PENDING] = [payment_entity_1.PaymentStatus.TREEZOR_WH_KO_MISC, payment_entity_1.PaymentStatus.TREEZOR_WH_KO_NOT_ENOUGH_BALANCE, payment_entity_1.PaymentStatus.CANCELLED, payment_entity_1.PaymentStatus.TREEZOR_WH_VALIDATED];
        validatedStatuses[payment_entity_1.PaymentStatus.TREEZOR_SYNC_KO_NOT_ENOUGH_BALANCE] = [payment_entity_1.PaymentStatus.BEING_PROCESSED, payment_entity_1.PaymentStatus.CANCELLED];
        validatedStatuses[payment_entity_1.PaymentStatus.TREEZOR_SYNC_KO_MISC] = [payment_entity_1.PaymentStatus.BEING_PROCESSED, payment_entity_1.PaymentStatus.CANCELLED];
        validatedStatuses[payment_entity_1.PaymentStatus.TREEZOR_WH_KO_NOT_ENOUGH_BALANCE] = [payment_entity_1.PaymentStatus.BEING_PROCESSED];
        validatedStatuses[payment_entity_1.PaymentStatus.TREEZOR_WH_KO_MISC] = [payment_entity_1.PaymentStatus.BEING_PROCESSED];
        validatedStatuses[payment_entity_1.PaymentStatus.TREEZOR_WH_VALIDATED] = [];
        validatedStatuses[payment_entity_1.PaymentStatus.CANCELLED] = [];
        if (validatedStatuses[event.databaseEntity.status].indexOf(event.entity.status) === -1) {
            throw new common_1.HttpException({ msg: 'api.error.payment.status', info: { databaseStatus: event.databaseEntity.status, newStatus: event.entity.status } }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    createHistory(entity, databaseEntity) {
        const historiesService = new histories_service_1.HistoriesService(typeorm_1.getRepository('History'));
        const params = { status: entity.status };
        if (databaseEntity) {
            params.oldStatus = databaseEntity.status;
        }
        switch (entity.status) {
            case payment_entity_1.PaymentStatus.REQUESTED:
                params.user = entity.paymentRequestUser;
                params.paymentId = entity.id;
                break;
            case payment_entity_1.PaymentStatus.BEING_PROCESSED:
                params.user = entity.paymentRequestUser;
                params.paymentId = entity.id;
                break;
            case payment_entity_1.PaymentStatus.TREEZOR_PENDING:
                params.paymentId = entity.id;
                params.treezorId = entity.treezorPayoutId;
                break;
            case payment_entity_1.PaymentStatus.TREEZOR_SYNC_KO_NOT_ENOUGH_BALANCE:
                params.paymentId = entity.id;
                break;
            case payment_entity_1.PaymentStatus.TREEZOR_SYNC_KO_MISC:
                params.treezorId = entity.treezorPayoutId;
                break;
            case payment_entity_1.PaymentStatus.TREEZOR_WH_KO_NOT_ENOUGH_BALANCE:
                params.paymentId = entity.id;
                params.treezorId = entity.treezorPayoutId;
                break;
            case payment_entity_1.PaymentStatus.TREEZOR_WH_KO_MISC:
                params.paymentId = entity.id;
                params.treezorId = entity.treezorPayoutId;
                break;
            case payment_entity_1.PaymentStatus.TREEZOR_WH_VALIDATED:
                params.paymentId = entity.id;
                params.treezorId = entity.treezorPayoutId;
                break;
            case payment_entity_1.PaymentStatus.CANCELLED:
                params.user = entity.paymentRequestUser;
                params.paymentId = entity.id;
                params.treezorId = entity.treezorPayoutId;
                break;
            default:
                break;
        }
        historiesService.createHistory({
            params,
            entity: history_entity_1.HistoryEntity.PAYMENT,
            entityId: (databaseEntity) ? databaseEntity.id : entity.id,
            event: histories_dto_1.HistoryEvent.UPDATE_STATUS,
        });
    }
    listenTo() {
        return payment_entity_1.Payment;
    }
    afterInsert(event) {
        if (event.entity.status) {
            this.createHistory(event.entity);
        }
    }
    afterUpdate(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.entity.status !== event.databaseEntity.status) {
                this.checkStatusChange(event);
                this.createHistory(event.entity, event.databaseEntity);
            }
        });
    }
};
PaymentSubscriber = __decorate([
    typeorm_1.EventSubscriber()
], PaymentSubscriber);
exports.PaymentSubscriber = PaymentSubscriber;
//# sourceMappingURL=payment.subscriber.js.map