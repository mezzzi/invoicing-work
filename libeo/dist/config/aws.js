"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_missing_key_utils_1 = require("./utils/check-missing-key.utils");
const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: process.env.AWS_BUCKET,
};
check_missing_key_utils_1.checkMissingKeys(awsConfig);
exports.default = awsConfig;
//# sourceMappingURL=aws.js.map