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
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const users_service_1 = require("../common/services/users.service");
let AuthService = class AuthService {
    constructor(jwtService, usersService) {
        this.jwtService = jwtService;
        this.usersService = usersService;
    }
    createToken(email) {
        return this.jwtService.sign({ email });
    }
    validateUser(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersService.findOneByEmail(payload.email);
            if (!user) {
                throw new common_1.HttpException('api.error.unauthorized', common_1.HttpStatus.UNAUTHORIZED);
            }
            if (user.enabled === false && !user.emailConfirmationToken) {
                throw new common_1.HttpException('api.error.user.disabled', common_1.HttpStatus.UNAUTHORIZED);
            }
            if (user.enabled === false && user.emailConfirmationToken) {
                throw new common_1.HttpException('api.error.user.not_activated', common_1.HttpStatus.UNAUTHORIZED);
            }
            if (user.blocked === true) {
                throw new common_1.HttpException('api.error.user.blocked', common_1.HttpStatus.UNAUTHORIZED);
            }
            return user;
        });
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map