const { web3, common, gasPrice, collectorAddress } = require("./network").getConfig();
const Tx = require('ethereumjs-tx').Transaction;
const Erc20Abi = require('./abis/Erc20.json');

const APPROVE_AMOUNT = web3.utils.toBN('1000000000000000000').muln(1000000);
const Erc20Token = new web3.eth.Contract(Erc20Abi);

class Account {
    constructor(address, key) {
        this.address = address;
        this.key = key;
        this.nonce = undefined;
    }
    
    async getBalance() {
        return web3.eth.getBalance(this.address);   
    }

    async sendEth(toAddress, amount) {
        return this.sendTx(toAddress, undefined, web3.utils.toHex(amount));
    }

    async sendAllEth(toAddress) {
        let balance = await web3.eth.getBalance(this.address);
        balance = web3.utils.toBN(balance).sub(web3.utils.toBN(gasPrice).muln(21000));
        const tx = await this.sendTx(toAddress, undefined, web3.utils.toHex(balance));
        return [tx, web3.utils.fromWei(balance, "ether")];
    }

    async sendToken(tokenAddress, to, amount) {
        const data = Erc20Token.methods.transfer(
            web3.utils.toChecksumAddress(to),
            web3.utils.toHex(amount),
        ).encodeABI();
        return this.sendTx(tokenAddress, data);
    }

    async approveCollector(tokenAddress) {
        const data = Erc20Token.methods.approve(
            collectorAddress,
            web3.utils.toHex(APPROVE_AMOUNT),
        ).encodeABI();
        return this.sendTx(tokenAddress, data);
    }

    sign(message) {
        return web3.eth.accounts.sign(message, this.key.toString("hex")).signature;
    }

    async sendTx(to, data = undefined, value = '0x', gasLimit = 400000) {
        this.nonce = this.nonce ? this.nonce + 1 : await web3.eth.getTransactionCount(this.address);
        var txObject = {};
        txObject.nonce = web3.utils.toHex(this.nonce);
        txObject.gasLimit = web3.utils.toHex(data ? gasLimit : 21000);
        txObject.gasPrice = web3.utils.toHex(gasPrice);
        txObject.to = web3.utils.toChecksumAddress(to);
        txObject.value = value;
        if (data) txObject.data = data;

        //Sign transaction before sending
        var tx = new Tx(txObject, { common });
        var privateKey = Buffer.from(this.key, 'hex')
        tx.sign(privateKey);
        var serializedTx = tx.serialize();
        return web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).then(tx => tx.transactionHash);
    }
}

module.exports = Account;