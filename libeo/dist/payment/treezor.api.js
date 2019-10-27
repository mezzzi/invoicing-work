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
const uuid = require("uuid");
const crypto = require("crypto");
const rp = require("request-promise-native");
const typeorm_1 = require("typeorm");
const webhooks_service_1 = require("../common/services/webhooks.service");
const webhook_entity_1 = require("../common/entities/webhook.entity");
const typeorm_2 = require("@nestjs/typeorm");
const nestjs_config_1 = require("nestjs-config");
const common_1 = require("@nestjs/common");
var MutationMethod;
(function (MutationMethod) {
    MutationMethod["POST"] = "POST";
    MutationMethod["PUT"] = "PUT";
    MutationMethod["DELETE"] = "DELETE";
})(MutationMethod = exports.MutationMethod || (exports.MutationMethod = {}));
let TreezorAPI = class TreezorAPI {
    constructor(webhookRepository, configService) {
        this.config = configService.get('treezor');
        this.webhook = new webhooks_service_1.WebhooksService(webhookRepository);
        this.defaultOptions = {
            json: true,
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + this.config.token,
                'Content-Type': 'application/json',
            },
        };
    }
    resetOptions() {
        delete this.defaultOptions.qs;
        delete this.defaultOptions.body;
        delete this.defaultOptions.form;
        delete this.defaultOptions.formData;
        this.defaultOptions.method = 'POST';
        this.defaultOptions.headers['Content-Type'] = 'application/json';
    }
    setGlobalProperties(props, sign = true) {
        props.accessTag = uuid.v4();
        if (sign) {
            props.accessSignature = this.computePayloadSignature(props);
        }
        return props;
    }
    setMutationCallOptions(endpoint, options, data) {
        const callOptions = Object.assign(this.defaultOptions, {
            uri: this.config.baseUrl + endpoint,
        });
        if (options.method) {
            callOptions.method = options.method;
        }
        if (options.formData) {
            callOptions.formData = data;
        }
        else if (options.form) {
            callOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            callOptions.form = data;
        }
        else {
            callOptions.body = data;
        }
        return callOptions;
    }
    computePayloadSignature(value) {
        return crypto
            .createHmac('sha256', this.config.secretKey)
            .update(JSON.stringify(value))
            .digest()
            .toString('base64');
    }
    mutation(endpoint, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.resetOptions();
            const data = this.setGlobalProperties(options.body || options.form || options.formData || {}, options.sign || null);
            const callOptions = this.setMutationCallOptions(endpoint, options, data);
            return rp(callOptions)
                .then(res => {
                if (!res) {
                    return Promise.resolve(null);
                }
                const keys = Object.keys(res);
                if (keys.length === 0) {
                    return Promise.resolve();
                }
                const [object] = res[keys[0]];
                this.webhook.createWebhook({
                    accessTag: data.accessTag,
                    requestPayload: data,
                    responsePayload: res
                });
                return Promise.resolve(object);
            })
                .catch(err => {
                this.webhook.createWebhook({
                    accessTag: data.accessTag,
                    requestPayload: data,
                    responsePayload: err.error
                });
                let { error } = err;
                if (error) {
                    const { errors } = error;
                    if (errors) {
                        [error] = errors;
                        err.code = error.errorCode;
                        err.message = error.errorMessage;
                    }
                }
                return Promise.reject(err);
            });
        });
    }
    query(endpoint, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.resetOptions();
            const callOptions = Object.assign(this.defaultOptions, {
                uri: this.config.baseUrl + endpoint,
                qs: this.setGlobalProperties(options.qs, options.sign || null),
                method: 'GET',
            });
            return rp(callOptions)
                .catch(err => {
                let { error } = err;
                const { errors } = error;
                [error] = errors;
                err.message = error.errorMessage;
                return Promise.reject(err);
            });
        });
    }
};
TreezorAPI = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_2.InjectRepository(webhook_entity_1.Webhook)),
    __param(1, nestjs_config_1.InjectConfig()),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        nestjs_config_1.ConfigService])
], TreezorAPI);
exports.TreezorAPI = TreezorAPI;
//# sourceMappingURL=treezor.api.js.map