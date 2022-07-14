const { saveNewTransaction } = require("../../interact-data-blockchain/listen-block-to-action")
const { web3 } = require("../../utils.js")
const tickToken = require("./tic-token.json")
const abi = tickToken.abi
const address = tickToken.address;

async function listenNewTransactionToSave(){
    const _web3 = web3()
    if (_web3) {
        let contract = new _web3.eth.Contract(abi, address)
        let options = {
            filter: {
                from: "0xC7446945830E99389AD2fd29707034f998bF65d8",
                to: "0x4b023d85601B6101CC6EE073E85A689D521e0B78",
                value: []
            },
            fromBlock: undefined,
            toBlock: undefined
        };
        saveNewTransaction(contract, options , 'transaction_of_tic_token.txt')
    }else {
        console.log("Can't nor connect to web3")
    }

}
listenNewTransactionToSave()