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
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const nestjs_config_1 = require("nestjs-config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_service_1 = require("./auth.service");
const jwt_strategy_1 = require("./jwt.strategy");
const common_module_1 = require("../common/common.module");
const user_entity_1 = require("../common/entities/user.entity");
const company_entity_1 = require("../common/entities/company.entity");
const users_service_1 = require("../common/services/users.service");
const token_generator_service_1 = require("../common/services/token-generator.service");
const auth_resolvers_1 = require("./auth.resolvers");
const notification_module_1 = require("../notification/notification.module");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    common_1.Module({
        imports: [
            passport_1.PassportModule.registerAsync({
                imports: [nestjs_config_1.ConfigModule],
                useFactory: (configService) => __awaiter(this, void 0, void 0, function* () { return configService.get('passport'); }),
                inject: [nestjs_config_1.ConfigService],
            }),
            jwt_1.JwtModule.registerAsync({
                imports: [nestjs_config_1.ConfigModule],
                useFactory: (configService) => __awaiter(this, void 0, void 0, function* () { return configService.get('jwt'); }),
                inject: [nestjs_config_1.ConfigService],
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, company_entity_1.Company]),
            common_module_1.CommonModule,
            notification_module_1.NotificationModule
        ],
        providers: [
            auth_service_1.AuthService,
            jwt_strategy_1.JwtStrategy,
            users_service_1.UsersService,
            auth_resolvers_1.AuthResolvers,
            token_generator_service_1.TokenGeneratorService,
        ],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map