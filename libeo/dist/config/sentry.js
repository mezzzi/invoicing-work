"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sentryConfig = {
    SENTRY_DSN: process.env.NODE_ENV === 'development' ? '' : process.env.SENTRY_DSN,
    RELEASE: 'api',
    ENVIRONMENT: process.env.SENTRY_ENV,
};
exports.default = sentryConfig;
//# sourceMappingURL=sentry.js.map