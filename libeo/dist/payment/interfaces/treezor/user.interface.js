"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserParentType;
(function (UserParentType) {
    UserParentType["SHAREHOLDER"] = "shareholder";
    UserParentType["EMPLOYEE"] = "employee";
    UserParentType["LEADER"] = "leader";
})(UserParentType = exports.UserParentType || (exports.UserParentType = {}));
var UserSpecifiedUSPerson;
(function (UserSpecifiedUSPerson) {
    UserSpecifiedUSPerson[UserSpecifiedUSPerson["No"] = 0] = "No";
    UserSpecifiedUSPerson[UserSpecifiedUSPerson["YES"] = 1] = "YES";
})(UserSpecifiedUSPerson = exports.UserSpecifiedUSPerson || (exports.UserSpecifiedUSPerson = {}));
var UserControllingPersonType;
(function (UserControllingPersonType) {
    UserControllingPersonType[UserControllingPersonType["Shareholder"] = 1] = "Shareholder";
    UserControllingPersonType[UserControllingPersonType["OTHER_RELATIONSHIP"] = 2] = "OTHER_RELATIONSHIP";
    UserControllingPersonType[UserControllingPersonType["DIRECTOR"] = 3] = "DIRECTOR";
    UserControllingPersonType[UserControllingPersonType["NONE"] = 4] = "NONE";
})(UserControllingPersonType = exports.UserControllingPersonType || (exports.UserControllingPersonType = {}));
var UserEmployeeType;
(function (UserEmployeeType) {
    UserEmployeeType[UserEmployeeType["LEADER"] = 1] = "LEADER";
    UserEmployeeType[UserEmployeeType["EMPLOYEE"] = 2] = "EMPLOYEE";
    UserEmployeeType[UserEmployeeType["NONE"] = 3] = "NONE";
})(UserEmployeeType = exports.UserEmployeeType || (exports.UserEmployeeType = {}));
var UserType;
(function (UserType) {
    UserType[UserType["NATURAL_PERSON"] = 1] = "NATURAL_PERSON";
    UserType[UserType["BUSINESS_ENTITY"] = 2] = "BUSINESS_ENTITY";
    UserType[UserType["NO_GOVERNMENTAL_ORGANIZATION"] = 3] = "NO_GOVERNMENTAL_ORGANIZATION";
    UserType[UserType["GOVERNMENTAL_ORGANIZATION"] = 4] = "GOVERNMENTAL_ORGANIZATION";
})(UserType = exports.UserType || (exports.UserType = {}));
var UserTitle;
(function (UserTitle) {
    UserTitle["M"] = "M";
    UserTitle["MME"] = "MME";
    UserTitle["MLLE"] = "MLLE";
})(UserTitle = exports.UserTitle || (exports.UserTitle = {}));
//# sourceMappingURL=user.interface.js.map