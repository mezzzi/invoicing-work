"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_missing_key_utils_1 = require("./utils/check-missing-key.utils");
const treezorConfig = {
    baseUrl: process.env.TREEZOR_API_URL,
    token: process.env.TREEZOR_TOKEN,
    secretKey: process.env.TREEZOR_SECRET_KEY,
    treezorAccountLibeo: process.env.TREEZOR_ACCOUNT_LIBEO,
};
check_missing_key_utils_1.checkMissingKeys(treezorConfig);
exports.default = treezorConfig;
//# sourceMappingURL=treezor.js.map