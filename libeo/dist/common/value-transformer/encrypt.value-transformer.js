"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
exports.encrypt = {
    to: (entityValue) => {
        try {
            const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.CRYPTO_KEY, 'hex'), Buffer.from(process.env.CRYPTO_IV, 'hex'));
            return cipher.update(entityValue, 'utf8', 'hex') + cipher.final('hex');
        }
        catch (err) {
            return entityValue;
        }
    },
    from: (databaseValue) => {
        try {
            const cipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.CRYPTO_KEY, 'hex'), Buffer.from(process.env.CRYPTO_IV, 'hex'));
            return cipher.update(databaseValue, 'hex', 'utf8') + cipher.final('utf8');
        }
        catch (err) {
            return databaseValue;
        }
    },
};
//# sourceMappingURL=encrypt.value-transformer.js.map