const { web3 } = require("./utils")
const { getContractTransactions } = require("./interact-data-blockchain/interract-transaction")
const tickToken = require("./interact_token/tick-token/tic-token.json")
const abi = tickToken.abi
const address = tickToken.address;
async function getTransaction() {
    const _web3 = web3()
    if (_web3) {
        let contract = new _web3.eth.Contract(abi, address)
        let options = {
            filter: {
                from: "0xC7446945830E99389AD2fd29707034f998bF65d8",
                to: "0x4b023d85601B6101CC6EE073E85A689D521e0B78",
                value: [],
            },
            fromBlock: 27168142,
            toBlock: 27168142
        };
        const transactions = await contract.getPastEvents('Transfer', options)
            .then(result => {
                console.log("result", result)
                return result
            })
        console.log(transactions)
    }
}
getTransaction()