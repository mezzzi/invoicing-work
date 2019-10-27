"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_missing_key_utils_1 = require("./utils/check-missing-key.utils");
const zendeskConfig = {
    ZENDESK_API_URL: process.env.ZENDESK_API_URL,
    ZENDESK_API_EMAIL: process.env.ZENDESK_API_EMAIL,
    ZENDESK_API_TOKEN: process.env.ZENDESK_API_TOKEN,
    ZENDESK_ENVIRONMENT: { id: 360001210059, value: process.env.NODE_ENV === 'test' ? 'Test' : process.env.ZENDESK_ENV },
};
check_missing_key_utils_1.checkMissingKeys(zendeskConfig);
exports.default = zendeskConfig;
//# sourceMappingURL=zendesk.js.map