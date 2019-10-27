"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkMissingKeys = (config) => {
    Object.keys(config).forEach(key => {
        if (typeof config[key] === 'undefined') {
        }
    });
};
//# sourceMappingURL=check-missing-key.utils.js.map