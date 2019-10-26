"use strict";
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
var MutationMethod;
(function (MutationMethod) {
    MutationMethod["POST"] = "POST";
    MutationMethod["PUT"] = "PUT";
    MutationMethod["DELETE"] = "DELETE";
})(MutationMethod = exports.MutationMethod || (exports.MutationMethod = {}));
class Utils {
    constructor(config) {
        this.config = config;
        this.webhook = new webhooks_service_1.WebhooksService(typeorm_1.getRepository(webhook_entity_1.Webhook));
        this.defaultOptions = {
            json: true,
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + config.token,
                'Content-Type': 'application/json',
            },
        };
    }
    resetOptions() {
        delete this.defaultOptions.qs;
        delete this.defaultOptions.body;
        delete this.defaultOptions.formData;
        this.defaultOptions.method = 'POST';
    }
    setGlobalProperties(props, sign = true) {
        props.accessTag = uuid.v4();
        props.accessUserId = this.config.userId || null;
        if (sign) {
            props.accessSignature = this.getSignature(props);
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
    getSignature(value) {
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
            this.webhook.createWebhook({
                accessTag: data.accessTag,
                requestPayload: data,
            });
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
                this.webhook.updateWebhook({ accessTag: data.accessTag }, { object_id: object[options.objectIdKey] || object.userId, responsePayload: res });
                return Promise.resolve(object);
            })
                .catch(err => {
                this.webhook.updateWebhook({ accessTag: data.accessTag }, { responsePayload: err.error });
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
}
exports.Utils = Utils;
//# sourceMappingURL=utils.service.js.map