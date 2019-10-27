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
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const user_entity_1 = require("../entities/user.entity");
const companies_service_1 = require("../services/companies.service");
const users_service_1 = require("../services/users.service");
const users_dto_1 = require("../dto/users.dto");
let UsersResolvers = class UsersResolvers {
    constructor(companiesService, usersService) {
        this.companiesService = companiesService;
        this.usersService = usersService;
    }
    refreshConfirmationTokenUser(ctx, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseUrl = (ctx.req.headers && ctx.req.headers.origin) ? ctx.req.headers.origin : null;
            const user = yield this.usersService.findOneByEmail(email);
            if (!user) {
                throw new common_1.HttpException('api.error.user.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            return this.usersService.confirmationToken(user, baseUrl);
        });
    }
    activateUser(confirmationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.usersService.activateUser(confirmationToken);
        });
    }
    updateUser(ctx, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.usersService.updateUser(ctx.req.user, data);
        });
    }
    me(ctx) {
        return ctx.req.user;
    }
    companies(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.companiesService.findByUser(user);
        });
    }
};
__decorate([
    graphql_1.Mutation(),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Args('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersResolvers.prototype, "refreshConfirmationTokenUser", null);
__decorate([
    graphql_1.Mutation(),
    __param(0, graphql_1.Args('confirmationToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersResolvers.prototype, "activateUser", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()), __param(1, graphql_1.Args('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, users_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersResolvers.prototype, "updateUser", null);
__decorate([
    graphql_1.Query(),
    common_1.UseGuards(new jwt_auth_guard_1.GqlAuthGuard()),
    __param(0, graphql_1.Context()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", user_entity_1.User)
], UsersResolvers.prototype, "me", null);
__decorate([
    graphql_1.ResolveProperty(),
    __param(0, graphql_1.Parent()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UsersResolvers.prototype, "companies", null);
UsersResolvers = __decorate([
    graphql_1.Resolver('User'),
    __metadata("design:paramtypes", [companies_service_1.CompaniesService,
        users_service_1.UsersService])
], UsersResolvers);
exports.UsersResolvers = UsersResolvers;
//# sourceMappingURL=users.resolvers.js.map