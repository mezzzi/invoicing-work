"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const contextService = require("request-context");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const nestjs_config_1 = require("nestjs-config");
const typeorm_1 = require("@nestjs/typeorm");
const graphql_1 = require("@nestjs/graphql");
const core_1 = require("@nestjs/core");
const nest_raven_1 = require("nest-raven");
const auth_module_1 = require("./auth/auth.module");
const common_module_1 = require("./common/common.module");
const naming_strategy_1 = require("./naming-strategy");
const notification_module_1 = require("./notification/notification.module");
const getConnectionOptions = () => {
    if (process.env.NODE_ENV === 'test') {
        return {
            type: 'sqljs',
            dropSchema: true,
            location: path_1.resolve(__dirname, '../e2e', 'libeo.db'),
            namingStrategy: new naming_strategy_1.CamelNamingStrategy(),
        };
    }
    return {
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT || '5432', 10),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        namingStrategy: new naming_strategy_1.SnakeNamingStrategy(),
    };
};
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(contextService.middleware('request'))
            .forRoutes({ path: '*', method: common_1.RequestMethod.ALL });
    }
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            nestjs_config_1.ConfigModule.load(path_1.resolve(__dirname, 'config', '**', '!(*.d).{ts,js}')),
            nest_raven_1.RavenModule,
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: (config) => {
                    const connectionOptions = getConnectionOptions();
                    const defaultConnectionOptions = {
                        logging: (process.env.TYPEORM_LOGGING === 'true'),
                        entities: [path_1.resolve(__dirname, '**/*.entity{.ts,.js}')],
                        subscribers: [path_1.resolve(__dirname, '**/*.subscriber{.ts,.js}')],
                        synchronize: (process.env.TYPEORM_SYNCHRONIZE === 'true'),
                    };
                    return Object.assign(defaultConnectionOptions, connectionOptions);
                },
                inject: [nestjs_config_1.ConfigService],
            }),
            graphql_1.GraphQLModule.forRootAsync({
                useFactory: (config) => config.get('graphql'),
                inject: [nestjs_config_1.ConfigService],
            }),
            common_module_1.CommonModule,
            notification_module_1.NotificationModule,
            auth_module_1.AuthModule,
        ],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useValue: new nest_raven_1.RavenInterceptor(),
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map