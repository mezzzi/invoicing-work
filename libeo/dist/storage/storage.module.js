"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const invoice_storage_service_1 = require("./invoice-storage.service");
const local_storage_service_1 = require("./local-storage.service");
const abstract_storage_service_1 = require("./abstract-storage.service");
const aws_storage_service_1 = require("./aws-storage.service");
const logo_storage_service_1 = require("./logo-storage.service");
const rib_storage_service_1 = require("./rib-storage.service");
const export_storage_service_1 = require("./export-storage.service");
const fileStorageServiceProvider = {
    provide: abstract_storage_service_1.AbstractStorageService,
    useClass: process.env.NODE_ENV === 'development'
        ? local_storage_service_1.LocalStorageService
        : aws_storage_service_1.AWSStorageService,
};
let StorageModule = class StorageModule {
};
StorageModule = __decorate([
    common_1.Module({
        providers: [common_1.Logger, fileStorageServiceProvider, invoice_storage_service_1.InvoiceStorageService, export_storage_service_1.ExportStorageService, rib_storage_service_1.RibStorageService, logo_storage_service_1.LogoStorageService],
        exports: [fileStorageServiceProvider, invoice_storage_service_1.InvoiceStorageService, export_storage_service_1.ExportStorageService, rib_storage_service_1.RibStorageService, logo_storage_service_1.LogoStorageService],
    })
], StorageModule);
exports.StorageModule = StorageModule;
//# sourceMappingURL=storage.module.js.map