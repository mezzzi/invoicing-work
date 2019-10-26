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
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const ExifTransformer = require("exif-be-gone");
const aws = require("aws-sdk");
const common_1 = require("@nestjs/common");
const invoice_entity_1 = require("../entities/invoice.entity");
let FileService = class FileService {
    constructor(file, options) {
        const { filename, mimetype } = file;
        this.originalFilename = filename;
        this.mimetype = mimetype;
        this.file = file;
        this.options = Object.assign({ dir: __dirname + '/../../../public/static' }, options);
        this.filename = this.generateFilename();
    }
    uploadLocal() {
        this.createDirectory();
        const filePath = path.join(this.options.dir, this.filename);
        const fsStream = fs.createWriteStream(filePath);
        return new Promise((resolve, reject) => {
            this.file.createReadStream()
                .pipe(new ExifTransformer())
                .pipe(fsStream)
                .on('error', reject)
                .on('finish', () => resolve({
                filePath,
                originalFilename: this.originalFilename,
                mimetype: this.mimetype,
            }));
        });
    }
    uploadS3() {
        const filePath = path.join(this.options.dir, this.filename).replace('/var/www/html/libeo/public/static/', '');
        const s3 = new aws.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });
        return new Promise((resolve, reject) => {
            s3.upload({
                Bucket: process.env.AWS_BUCKET,
                Key: filePath,
                Body: this.file.createReadStream(),
                ContentType: this.mimetype,
            }, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({
                        filePath: data.Location,
                        originalFilename: this.originalFilename,
                        mimetype: this.mimetype,
                    });
                }
            });
        });
    }
    createDirectory() {
        if (!fs.existsSync(this.options.dir)) {
            fs.mkdirSync(this.options.dir, { recursive: true });
        }
    }
    upload() {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.STORAGE_MODE === 's3') {
                return this.uploadS3();
            }
            return this.uploadLocal();
        });
    }
    getExtension() {
        const extension = /(?:\.([^.]+))?$/.exec(this.originalFilename)[1];
        if (!extension) {
            throw new common_1.HttpException('api.error.upload_extension_not_found', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!Object.values(invoice_entity_1.InvoiceExtension).includes(this.mimetype)) {
            throw new common_1.HttpException('api.error.upload_extension_unauthorized', common_1.HttpStatus.BAD_REQUEST);
        }
        return extension;
    }
    generateFilename() {
        const newFilename = uuid.v4() + '.' + this.getExtension();
        return newFilename;
    }
};
FileService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [Object, Object])
], FileService);
exports.FileService = FileService;
//# sourceMappingURL=files.service.js.map