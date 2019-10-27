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
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const fs = require("fs");
const express = require("express");
const Sentry = require("@sentry/node");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = express();
        const expressAdapter = new platform_express_1.ExpressAdapter(server);
        expressAdapter.useStaticAssets('public', { setHeaders: (res) => { res.set('Access-Control-Allow-Origin', '*'); } });
        const app = yield core_1.NestFactory.create(app_module_1.AppModule, expressAdapter);
        const sentryConfig = app.get('ConfigService').get('sentry');
        Sentry.init({ dsn: sentryConfig.SENTRY_DSN, release: sentryConfig.RELEASE, environment: sentryConfig.ENVIRONMENT });
        app.enableCors();
        app.useGlobalPipes(new common_1.ValidationPipe());
        const port = process.env.PORT || 9000;
        if (port && (typeof port === 'string') && fs.existsSync(port) && fs.lstatSync(port).isSocket()) {
            fs.unlinkSync(port);
        }
        yield app.listen(port);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map