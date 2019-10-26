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
const fs = require("fs");
const path = require("path");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const accounting_preference_entity_1 = require("../entities/accounting-preference.entity");
let UserSubscriber = class UserSubscriber {
    createDefaultAccountingPreferences() {
        return __awaiter(this, void 0, void 0, function* () {
            const repository = typeorm_1.getRepository(accounting_preference_entity_1.AccountingPreference);
            const rawData = fs.readFileSync(path.resolve(__dirname, '../../../locales/fr', 'accounting-preferences.json'));
            const data = JSON.parse(rawData);
            let accountingPreferences = yield repository.find({ company: null });
            if (accountingPreferences.length === 0) {
                accountingPreferences = repository.create(data);
            }
            else {
                accountingPreferences = Object.assign(accountingPreferences, data);
            }
            yield repository.save(accountingPreferences);
        });
    }
    listenTo() {
        return user_entity_1.User;
    }
    afterInsert(event) {
        this.createDefaultAccountingPreferences();
    }
};
UserSubscriber = __decorate([
    typeorm_1.EventSubscriber()
], UserSubscriber);
exports.UserSubscriber = UserSubscriber;
//# sourceMappingURL=user.subscriber.js.map