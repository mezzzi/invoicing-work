"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const common_1 = require("@nestjs/common");
let TokenGeneratorService = class TokenGeneratorService {
    generateToken() {
        return crypto.randomBytes(32).toString('hex').replace('+/', '-_').replace('=', '').trim();
    }
};
TokenGeneratorService = __decorate([
    common_1.Injectable()
], TokenGeneratorService);
exports.TokenGeneratorService = TokenGeneratorService;
//# sourceMappingURL=token-generator.service.js.map