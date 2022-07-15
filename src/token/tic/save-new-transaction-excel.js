const { web3 } = require("../../../lib/utils")
const { getDataEvent } = require("../../interact-blockchain/event")
const { addTransactions } = require("../../interact-excel/add-transaction")
const { getData } = require("../../interact-excel/getData")

const tickToken = require("./token.json")
const abi = tickToken.abi
const address = tickToken.address;
const blockNumberDeploy = tickToken.receipt.logs[0].blockNumber;
const blockFilterCurrent = blockNumberDeploy;

//Can only get range heigh block is 1000 
const tranOn1000Block =  async(_fromBlock, _toBlock) =>{
    const _web3 = web3()
    if (_web3) {
        let contract = new _web3.eth.Contract(abi, address)
        let options = {
            fromBlock: _fromBlock,
            toBlock: _toBlock
        };
        const newTransactions = await getDataEvent(contract, options, "Transfer")
        return newTransactions
    }

}
async function getNewTransactions(fileName) {
    const _web3 = web3()
    var allNewTransaction
    const currentBlock = await _web3.eth.getBlockNumber()
    var _fromBlock = blockFilterCurrent
    const data = getData(fileName)
    if (data != -1) {
        const dataLength = Object.keys(data).length
        const blockSaved = data[dataLength - 1].Block
        _fromBlock = blockSaved
    }

    var _toBlock = await updateToBlockFilter()
    while(_toBlock <= currentBlock){
        const transaction = await tranOn1000Block(_fromBlock, _toBlock)
        console.log("transaction: ", transaction)
        if(typeof(allNewTransaction) != undefined){
            allNewTransaction = transaction
        }else {
            allNewTransaction.push(transaction)
        }
        _fromBlock = _toBlock
        _toBlock = await updateToBlockFilter()
    }
    return allNewTransaction
}


async function updateToBlockFilter() {
    try {
        const _web3 = web3()
        const currentBlock = await _web3.eth.getBlockNumber()
        if (blockFilterCurrent >= currentBlock) {
            return blockFilterCurrent
        }
        if (blockFilterCurrent + 1000 > currentBlock) {
            return currentBlock
        }
        else {
            return blockFilterCurrent + 1000
        }
    } catch (error) {
        console.log(error)
    }
}

async function addNewTransationsExcel(fileName) {
    const newTransactions = await getNewTransactions()
    console.log("all new transation", newTransactions)
    if (newTransactions == "[]" && newTransactions != 'undefined') {
        console.log("No new transactions")
        return
    }
    const workSheetColumnNames = [
        "From",
        "To",
        "Value",
        "Hash",
        "Block"
    ]
    const workSheetName = "Transaction of Tic Token"
    addTransactions(fileName, newTransactions, workSheetColumnNames, workSheetName)
}
addNewTransationsExcel("transaction_of_tic_token.xlsx")
