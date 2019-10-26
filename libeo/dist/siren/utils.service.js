"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Type;
(function (Type) {
    Type["SIRET"] = "siret";
    Type["SIREN"] = "siren";
    Type["QUERY"] = "raisonSociale";
})(Type = exports.Type || (exports.Type = {}));
class Utils {
    getPrefix(str) {
        const regex = /(^[\d+]{1,9}$)|(^[\d+]{9,14}$)|(^[a-z\d\-_\s]+$)/i;
        let prefix = '';
        const m = regex.exec(str);
        if (m !== null) {
            m.forEach((match, groupIndex) => {
                if (match && groupIndex === 1) {
                    prefix = Type.SIREN;
                }
                else if (match && groupIndex === 2) {
                    prefix = Type.SIRET;
                }
                else if (match && groupIndex === 3) {
                    prefix = Type.QUERY;
                }
            });
        }
        return prefix;
    }
}
exports.Utils = Utils;
//# sourceMappingURL=utils.service.js.map