"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const naming_strategy_1 = require("../naming-strategy");
const typeOrmConfig = {
    name: 'default',
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    logging: true,
    entities: [path_1.resolve(__dirname, '**/*.entity{.ts,.js}')],
    subscribers: [path_1.resolve(__dirname, '**/*.subscriber{.ts,.js}')],
    namingStrategy: new naming_strategy_1.SnakeNamingStrategy(),
    synchronize: true,
};
exports.default = typeOrmConfig;
//# sourceMappingURL=typeorm.js.map