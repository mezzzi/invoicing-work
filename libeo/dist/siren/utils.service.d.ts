export declare enum SearchCompaniesType {
    SIRET = "siret",
    SIREN = "siren",
    QUERY = "raisonSociale"
}
export declare const getPrefixTypeSearchCompanies: (str: string) => SearchCompaniesType;
