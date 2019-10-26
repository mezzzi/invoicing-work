"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwtConfig = {
    secretOrPrivateKey: process.env.JWT_SECRET,
    signOptions: {
        expiresIn: parseInt(process.env.JWT_EXPIRESIN, 10),
    },
};
exports.default = jwtConfig;
//# sourceMappingURL=jwt.js.map