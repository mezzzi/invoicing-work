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
const fastcsv = require("fast-csv");
const fs = require("fs");
const uuid = require("uuid");
const path = require("path");
const moment = require("moment");
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("@nestjs/typeorm");
const export_entity_1 = require("../entities/export.entity");
const accounting_entry_entity_1 = require("../entities/accounting-entry.entity");
const accounting_entry_repository_1 = require("../repositories/accounting-entry.repository");
const export_storage_service_1 = require("../../storage/export-storage.service");
let ExportsService = class ExportsService {
    constructor(exportRepository, accountingEntryRepository, exportStorageService) {
        this.exportRepository = exportRepository;
        this.accountingEntryRepository = accountingEntryRepository;
        this.exportStorageService = exportStorageService;
    }
    generate(company) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!company) {
                throw new common_1.NotFoundException('api.error.company.not_found');
            }
            const fileName = `export-${uuid.v4()}.csv`;
            const headers = ['Date', 'Code journal', 'Libellé journal', 'Code compte', 'Label écriture', 'Ref écriture', 'Sens', 'Montant', 'Devise'];
            const accountingEntries = yield this.accountingEntryRepository.findByCompanyAndExportIdEmpty(company);
            const data = accountingEntries.map(entry => {
                return [
                    moment(entry.entryDate).format('DD/MM/YYYY'),
                    (entry.ledger && entry.ledger.value) ? entry.ledger.value : '',
                    (entry.ledger && entry.ledger.key) ? entry.ledger.key : '',
                    (entry.account && entry.account.value) ? entry.account.value : '',
                    entry.entryLabel || '',
                    entry.entryRef || '',
                    entry.postingType || '',
                    entry.entryAmount || 0,
                    entry.entryCurrency || '',
                ];
            });
            data.unshift(headers);
            try {
                yield new Promise((resolve, reject) => {
                    fastcsv
                        .writeToPath(path.resolve(fileName), data, { headers: true })
                        .on('error', reject)
                        .on('finish', resolve);
                });
            }
            catch (err) {
                throw new common_1.BadRequestException('api.error.export.generate');
            }
            try {
                const createReadStream = () => {
                    return fs.createReadStream(fileName);
                };
                const file = { createReadStream, filename: fileName, mimetype: 'text/csv', encoding: null };
                const { fileLocation } = yield this.exportStorageService.upload(file, company.id);
                yield fs.unlinkSync(fileName);
                yield this.exportRepository.save(this.exportRepository.create({
                    company,
                    enabled: true,
                    fileLink: fileLocation,
                }));
                return fileLocation;
            }
            catch (err) {
                throw new common_1.BadRequestException(err.message);
            }
        });
    }
    findByCompany(company, orderBy, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!company) {
                throw new common_1.HttpException('api.error.company.not_found', common_1.HttpStatus.NOT_FOUND);
            }
            const [rows, total] = yield this.exportRepository.findAndCount({ where: { company }, relations: ['company'], skip: offset, take: limit });
            return {
                total,
                rows,
            };
        });
    }
};
ExportsService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_2.InjectRepository(export_entity_1.Export)),
    __param(1, typeorm_2.InjectRepository(accounting_entry_entity_1.AccountingEntry)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        accounting_entry_repository_1.AccountingEntryRepository,
        export_storage_service_1.ExportStorageService])
], ExportsService);
exports.ExportsService = ExportsService;
//# sourceMappingURL=exports.service.js.map