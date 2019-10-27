"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SearchCompaniesType;
(function (SearchCompaniesType) {
    SearchCompaniesType["SIRET"] = "siret";
    SearchCompaniesType["SIREN"] = "siren";
    SearchCompaniesType["QUERY"] = "raisonSociale";
})(SearchCompaniesType = exports.SearchCompaniesType || (exports.SearchCompaniesType = {}));
exports.getPrefixTypeSearchCompanies = (str) => {
    const regex = /(^[\d+]{1,9}$)|(^[\d+]{9,14}$)|(^[a-z\d\-_\s]+$)/i;
    let prefix = null;
    const m = regex.exec(str);
    if (m !== null) {
        m.forEach((match, groupIndex) => {
            if (match && groupIndex === 1) {
                prefix = SearchCompaniesType.SIREN;
            }
            else if (match && groupIndex === 2) {
                prefix = SearchCompaniesType.SIRET;
            }
            else if (match && groupIndex === 3) {
                prefix = SearchCompaniesType.QUERY;
            }
        });
    }
    return prefix;
};
//# sourceMappingURL=utils.service.js.map