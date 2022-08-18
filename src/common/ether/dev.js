const { web3, collectorAddress } = require("./network").getConfig();
const Account = require('./account');
const CollectorAbi = require('./abis/Collector.json');

const Collector = new web3.eth.Contract(CollectorAbi, collectorAddress);

class DevAccount extends Account {
    constructor() {
        super(process.env.DEV_ADDRESS, process.env.DEV_KEY);
    }

    async collect(token, treasury, owners) {
        const data = Collector.methods.collect(
            web3.utils.toChecksumAddress(token),
            web3.utils.toChecksumAddress(treasury),
            owners.map(a => web3.utils.toChecksumAddress(a))
        ).encodeABI();
        return this.sendTx(collectorAddress, data, '0x', 10000000);
    }

    async collectAndDisperse(token, treasury, owners, scholars, rate = 50) {
        const data = Collector.methods.collectAndDisperse(
            web3.utils.toChecksumAddress(token),
            web3.utils.toChecksumAddress(treasury),
            owners.map(a => web3.utils.toChecksumAddress(a)),
            scholars.map(a => web3.utils.toChecksumAddress(a)),
            web3.utils.toHex(rate)
        ).encodeABI();
        return this.sendTx(collectorAddress, data, '0x', 10000000);
    }

    async getCollectLog(fromBlock, toBlock) {
        const pastLogs = await web3.eth.getPastLogs({
            fromBlock,
            toBlock,
            address: collectorAddress,
            topics: ['0x1314fd112a381beea61539dbd21ec04afcff2662ac7d1b83273aade1f53d1b97'],
        })

        let logs = [];
        for (let log of pastLogs) {
            const token = web3.eth.abi.decodeParameters(['address'], log.topics[1])[0]
            const from = web3.eth.abi.decodeParameters(['address'], log.topics[2])[0]
            const amount = web3.eth.abi.decodeParameters(['uint256'], log.data)[0]
            logs.push({ token, from, amount })
        }
        return logs;
    }

    async getDisperseLog(fromBlock, toBlock) {
        const pastLogs = await web3.eth.getPastLogs({
            fromBlock,
            toBlock,
            address: collectorAddress,
            topics: ['0x14791e3d806a1a81202d2a5b1658f1a4a2a6433d26e46df0b832310300a8a328'],
        })

        let logs = [];
        for (let log of pastLogs) {
            const token = web3.eth.abi.decodeParameters(['address'], log.topics[1])[0]
            const from = web3.eth.abi.decodeParameters(['address'], log.topics[2])[0]
            const values = web3.eth.abi.decodeParameters(['address', 'uint256'], log.data)
            logs.push({ token, from, to: values[0], amount: values[1] })
        }
        return logs;
    }
}

module.exports = DevAccount;