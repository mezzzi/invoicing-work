"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const value = (!process.env.DOMAIN) ? 'Local' : (process.env.DATABASE_NAME === 'libeopp') ? 'Sandbox' : 'Production';
exports.environmentZendesk = { id: 360001210059, value };
//# sourceMappingURL=constants.js.map