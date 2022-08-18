const { hdkey } = require("ethereumjs-wallet");
const Account = require("./account");

class Manager {
    constructor(seed, nAccount = 1) {
        const seedBuffer = Buffer.from(seed, "hex");
        this.master = hdkey.fromMasterSeed(seedBuffer);
        this.parent = this.master.derivePath("m/44'/60'/0'/0")
        this.accounts = {};
        this.addressByIdx = {};
        this.addressIdx = {};
        this.nAccount = nAccount;
        this.init();
    }

    init() {
        for (let i = 0; i < this.nAccount; i++) {
            const wallet = this.parent.deriveChild(i).getWallet();
            const address = wallet.getAddressString();
            this.accounts[address.toLowerCase()] = new Account(address, wallet.getPrivateKey());
            this.addressByIdx[i] = address.toLowerCase();
            this.addressIdx[address.toLowerCase()] = i;
        }
        console.log("Init manager done");
    }

    getAccount(address) {
        return this.accounts[address.toLowerCase()];
    }

    getAccounts() {
        return this.accounts;
    }

    getAccountByIdx(index) {
        return this.accounts[this.addressByIdx[index]];
    }

    getAccountIdx(address) {
        return this.addressIdx[address.toLowerCase()];
    }
}

module.exports = Manager;