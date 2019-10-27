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
const jenji_strategy_1 = require("./strategies/jenji.strategy");
const common_1 = require("@nestjs/common");
class OcrService {
    constructor(type, config) {
        this.strategy = null;
        this.isLoadFile = false;
        if (type === 'jenji') {
            this.strategy = new jenji_strategy_1.JenjiStrategy(config);
        }
        if (this.strategy === null) {
            throw new Error('api.error.ocr.strategy_not_found');
        }
    }
    loadFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (filePath.indexOf('http://localhost') !== -1) {
                const localFilePath = filePath.replace('http://localhost:9000/static/', '');
                const completeFilePath = path.join(process.cwd(), '/public/static', localFilePath.substring(1, localFilePath.length));
                if (!fs.existsSync(completeFilePath)) {
                    throw new Error('api.error.ocr.file_not_found');
                }
            }
            try {
                yield this.strategy.loadFile(filePath);
                this.isLoadFile = true;
            }
            catch (err) {
                throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
            }
        });
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isLoadFile === false) {
                throw new Error('api.error.ocr.file_load');
            }
            return this.strategy.getData();
        });
    }
}
exports.OcrService = OcrService;
//# sourceMappingURL=ocr.service.js.map