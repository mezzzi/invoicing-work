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
const fs = require("fs");
const url = require("url");
const https = require("https");
const rp = require("request-promise-native");
class JenjiStrategy {
    constructor(config) {
        this.config = config;
    }
    getBasicToken() {
        return Buffer.from(this.config.username + ':' + this.config.apiKey).toString('base64');
    }
    loadFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (filePath.indexOf('http') !== -1) {
                return new Promise((resolve, reject) => {
                    https.get(filePath, res => {
                        this.file = res;
                        resolve();
                    });
                });
            }
            else {
                return new Promise((resolve, reject) => {
                    this.file = fs.createReadStream(filePath);
                    this.file.on('ready', resolve);
                    this.file.on('error', reject);
                });
            }
        });
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultOptions = {
                json: true,
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + this.getBasicToken(),
                    'Content-Type': 'multipart/form-data',
                },
                formData: {
                    file: this.file,
                },
            };
            return Promise.all([
                rp(Object.assign({ uri: url.resolve(this.config.baseUrl, '/s/extract/multipart') }, defaultOptions)),
                rp(Object.assign({ uri: url.resolve(this.config.baseUrl, '/s/raw/multipart') }, defaultOptions)),
            ]);
        });
    }
}
exports.JenjiStrategy = JenjiStrategy;
//# sourceMappingURL=jenji.strategy.js.map