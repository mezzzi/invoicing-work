"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WalletStatus;
(function (WalletStatus) {
    WalletStatus["VALIDATED"] = "validated";
    WalletStatus["CANCELLED"] = "cancelled";
    WalletStatus["PENDING"] = "pending";
})(WalletStatus = exports.WalletStatus || (exports.WalletStatus = {}));
var WalletType;
(function (WalletType) {
    WalletType[WalletType["ElectronicMoneyWallet"] = 9] = "ElectronicMoneyWallet";
    WalletType[WalletType["PaymentAccountWallet"] = 10] = "PaymentAccountWallet";
    WalletType[WalletType["MirrorWallet"] = 13] = "MirrorWallet";
    WalletType[WalletType["ElectronicMoneyCard"] = 14] = "ElectronicMoneyCard";
})(WalletType = exports.WalletType || (exports.WalletType = {}));
//# sourceMappingURL=wallet.interface.js.map