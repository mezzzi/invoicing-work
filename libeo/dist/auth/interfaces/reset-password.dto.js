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
const class_validator_1 = require("class-validator");
const signup_dto_1 = require("./signup.dto");
class SendPasswordResetEmail {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], SendPasswordResetEmail.prototype, "email", void 0);
exports.SendPasswordResetEmail = SendPasswordResetEmail;
class ResetPasswordPayload {
}
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], ResetPasswordPayload.prototype, "confirmationToken", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.Matches(signup_dto_1.PASSWORD_PATTERN),
    __metadata("design:type", String)
], ResetPasswordPayload.prototype, "password", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.Matches(signup_dto_1.PASSWORD_PATTERN),
    __metadata("design:type", String)
], ResetPasswordPayload.prototype, "confirmPassword", void 0);
exports.ResetPasswordPayload = ResetPasswordPayload;
class PasswordReset {
}
exports.PasswordReset = PasswordReset;
//# sourceMappingURL=reset-password.dto.js.map