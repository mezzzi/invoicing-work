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
const path = require("path");
const abstract_storage_service_1 = require("./abstract-storage.service");
const ensureDirectoryExistence = (filePath) => {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    fs.mkdirSync(dirname, { recursive: true });
};
class LocalStorageService extends abstract_storage_service_1.AbstractStorageService {
    uploadImplementation(file, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const uri = path.join('/static', filePath);
            const localFilePath = path.join(process.cwd(), '/public', uri);
            ensureDirectoryExistence(localFilePath);
            const fsStream = fs.createWriteStream(localFilePath);
            try {
                yield new Promise((resolve, reject) => {
                    file.createReadStream()
                        .pipe(fsStream)
                        .on('error', reject)
                        .on('finish', resolve);
                });
                const baseUrl = `http://localhost:${process.env.PORT || 9000}`;
                return Promise.resolve({ fileLocation: `${baseUrl}${uri}` });
            }
            catch (err) {
                throw new Error(err);
            }
        });
    }
}
exports.LocalStorageService = LocalStorageService;
//# sourceMappingURL=local-storage.service.js.map