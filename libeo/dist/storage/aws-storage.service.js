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
const aws = require("aws-sdk");
const common_1 = require("@nestjs/common");
const nestjs_config_1 = require("nestjs-config");
const abstract_storage_service_1 = require("./abstract-storage.service");
let AWSStorageService = class AWSStorageService extends abstract_storage_service_1.AbstractStorageService {
    constructor(config, logger) {
        super(logger);
        this.logger = logger;
        const awsConfig = config.get('aws');
        this.bucket = awsConfig.bucket;
        this.AWSS3Service = new aws.S3({
            accessKeyId: awsConfig.accessKeyId,
            secretAccessKey: awsConfig.secretAccessKey
        });
    }
    uploadImplementation(file, filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fileLocation } = yield new Promise((resolve, reject) => {
                    this.AWSS3Service.upload({
                        Bucket: this.bucket,
                        Key: filePath,
                        Body: file.createReadStream(),
                        ContentType: file.mimetype,
                    }, (err, data) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve({
                                fileLocation: data.Location
                            });
                        }
                    });
                });
                return { fileLocation };
            }
            catch (err) {
                this.logger.error(`Error during upload: ${err.message}`);
                throw err;
            }
        });
    }
};
AWSStorageService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [nestjs_config_1.ConfigService,
        common_1.Logger])
], AWSStorageService);
exports.AWSStorageService = AWSStorageService;
//# sourceMappingURL=aws-storage.service.js.map