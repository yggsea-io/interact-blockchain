const { saveNewEventToFile } = require("../../interact-blockchain/event")
const { web3 } = require("../../../lib/utils")
const tickToken = require("./token.json")
const abi = tickToken.abi
const address = tickToken.address;
const eviroment_mumbai = process.env.EVIROMENT_MUMBAI;
const _web3 = web3(eviroment_mumbai)
//save transaction to file txt
async function listenNewTransactionToSave(options , filePath){
    if (_web3) {
        let contract = new _web3.eth.Contract(abi, address)
        let eventFieldNames = ['from', 'to', 'value']
        saveNewEventToFile(contract, 'Transfer', eventFieldNames ,options , filePath)
    }else {
        console.log("Can't connect to web3")
    }
}

async function saveNewTranFilterFrom(from, filePath){ 
    let options = {
        filter: {
            from: from
        },
        fromBlock: undefined,
        toBlock: undefined
    };
    await listenNewTransactionToSave(options, filePath)
}
async function saveNewTranFilterTo(to, filePath){
    let options = {
        filter: {
            to: to
        },
        fromBlock: undefined,
        toBlock: undefined
    };
    await listenNewTransactionToSave(options, filePath)
}
async function saveNewTranFilterValue(value, filePath){
    let options = {
        filter: {
            value: value
        },
        fromBlock: undefined,
        toBlock: undefined
    };
    await listenNewTransactionToSave(options, filePath)
}
//saveNewTranFilterFrom('0xC7446945830E99389AD2fd29707034f998bF65d8', './transaction-filter-from.txt')
// saveNewTranFilterTo('0x4b023d85601B6101CC6EE073E85A689D521e0B78', './transaction-filter-to.txt')
// saveNewTranFilterValue([350, 500], './transaction-filter-value.txt')
saveNewTranFilterValue([], './transaction.txt')