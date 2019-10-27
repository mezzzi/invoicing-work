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
class AbstractStorageService {
    constructor(logger) {
        this.logger = logger;
        if (this.constructor === AbstractStorageService) {
            throw new TypeError('Abstract class "AbstractStorageService" cannot be instantiated directly');
        }
    }
    uploadImplementation(file, filePath) {
        throw new Error('NOT IMPLEMENTED');
    }
    upload(file, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileLocation = yield this.uploadImplementation(file, filePath);
                return fileLocation;
            }
            catch (err) {
                this.logger.error(`Error during the upload ${filePath}`);
            }
        });
    }
}
exports.AbstractStorageService = AbstractStorageService;
//# sourceMappingURL=abstract-storage.service.js.map