const axios = require("axios");
const { v4: uuidv4 } = require('uuid');
const { web3, collectorAddress } = require("./network").getConfig();
const Erc20Abi = require('./abis/Erc20.json');
const { sleep } = require('./utils');

const BASE_URL = 'http://localhost:8889/v1/mock/wallets';
const APPROVE_AMOUNT = web3.utils.toBN('1000000000000000000').muln(1000000);

class Cybavo {
    constructor(walletId, orderIdPrefix) {
        this.walletId = walletId;
        this.orderIdPrefix = orderIdPrefix;
        this.addressIdx = {};
    }

    getIdx(address) {
        return this.addressIdx[address];
    }

    generateOrderId() {
        const randomStr = uuidv4().toUpperCase();
        return this.orderIdPrefix + randomStr.substr(0, 8);
    }

    async init(request_number = 5000) {
        const addresses = await axios.get(
            `${BASE_URL}/${this.walletId}/addresses`,
            { request_number });
        const { wallet_address, wallet_count } = addresses.data;
        for (let w of wallet_address) {
            this.addressIdx[w.address] = w.address_index;
            this.addressIdx[w.address.toLowerCase()] = w.address_index;
        }
        console.log(`Cybavo init done! (${wallet_count} wallets)`)
    }

    async sign(wallet_address, message) {
        const index = this.addressIdx[wallet_address];
        if (!index) throw new Error(`Invalid address ${wallet_address}`);
        const rs = await axios.post(
            `${BASE_URL}/${this.walletId}/signmessage`,
            { wallet_address, index, message })
        return rs.data.signed_message;
    }

    async sendTxs(requests) {
        const rs = await axios.post(
            `${BASE_URL}/${this.walletId}/sender/transactions`,
            { requests })
        return rs.data;
    }

    async allowanceCollector(tokenAddress, accounts) {
        const Erc20Token = new web3.eth.Contract(Erc20Abi, tokenAddress);
        for (let account of accounts) {
            const allowance = await Erc20Token.methods.allowance(account, collectorAddress).call();
            console.log(`${account},${allowance.toString()}`);
            await sleep(100);
        }
    }

    async approveCollector(tokenAddress, accounts) {
        const Erc20Token = new web3.eth.Contract(Erc20Abi, tokenAddress);
        const data = Erc20Token.methods.approve(
            collectorAddress,
            web3.utils.toHex(APPROVE_AMOUNT),
        ).encodeABI();
        const contract_abi = "approve:0x" + data.substr(10);
        const requests = [];
        for (let account of accounts) {
            requests.push({
                'order_id': this.generateOrderId(),
                'address': tokenAddress,
                'amount': "0",
                'from_address': account,
                'from_address_index': this.getIdx(account),
                contract_abi
            });
        }
        return this.sendTxs(requests);
    }

    async sendToken(tokenAddress, account, to, amount) {
        const Erc20Token = new web3.eth.Contract(Erc20Abi, tokenAddress);
        const data = Erc20Token.methods.transfer(
            web3.utils.toChecksumAddress(to),
            web3.utils.toHex(amount),
        ).encodeABI();
        const contract_abi = "transfer:0x" + data.substr(10);
        const requests = [{
            'order_id': this.generateOrderId(),
            'address': tokenAddress,
            'amount': "0",
            'from_address': account,
            'from_address_index': this.getIdx(account),
            contract_abi
        }]
        return this.sendTxs(requests);
    }

    async sendTokenFromMultiAccount(tokenAddress, accounts, to, amount) {
        const Erc20Token = new web3.eth.Contract(Erc20Abi, tokenAddress);
        const data = Erc20Token.methods.transfer(
            web3.utils.toChecksumAddress(to),
            web3.utils.toHex(amount),
        ).encodeABI();
        const contract_abi = "transfer:0x" + data.substr(10);
        const requests = []
        for (let account of accounts) {
            requests.push({
                'order_id': this.generateOrderId(),
                'address': tokenAddress,
                'amount': "0",
                'from_address': account,
                'from_address_index': this.getIdx(account),
                contract_abi
            });
        }
        return this.sendTxs(requests);
    }
}

module.exports = Cybavo;