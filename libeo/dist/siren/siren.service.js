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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const siren_strategy_1 = require("./strategies/siren.strategy");
const treezor_strategy_1 = require("./strategies/treezor.strategy");
const common_1 = require("@nestjs/common");
var Strategies;
(function (Strategies) {
    Strategies["SirenStrategy"] = "SirenStrategy";
    Strategies["TreezorStrategy"] = "TreezorStrategy";
})(Strategies || (Strategies = {}));
let SirenService = class SirenService {
    constructor(sirenStrategy, treezorStrategy, logger) {
        this.sirenStrategy = sirenStrategy;
        this.treezorStrategy = treezorStrategy;
        this.logger = logger;
        this.strategy = Strategies.SirenStrategy;
    }
    switchStrategy(strategy) {
        this.strategy = strategy;
        this.logger.log(`Search - Switch to ${strategy}`);
        setTimeout(() => {
            this.strategy = Strategies.SirenStrategy;
        }, 600000);
    }
    search(query, orderBy, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.strategy === Strategies.SirenStrategy) {
                try {
                    const results = yield this.sirenStrategy.search(query, orderBy, limit, offset);
                    return results;
                }
                catch (err) {
                    if (err.error && err.error.code && (err.error.code === 'ETIMEDOUT' || err.error.code === 'ESOCKETTIMEDOUT')) {
                        this.switchStrategy(Strategies.TreezorStrategy);
                    }
                }
            }
            return this.treezorStrategy.search(query, orderBy, limit, offset);
        });
    }
};
SirenService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [siren_strategy_1.SirenStrategy,
        treezor_strategy_1.TreezorStrategy,
        common_1.Logger])
], SirenService);
exports.SirenService = SirenService;
//# sourceMappingURL=siren.service.js.map