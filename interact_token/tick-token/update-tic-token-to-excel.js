const { web3 } = require("../../utils")
const { getContractTransactions } = require("../../interact-data-blockchain/interract-transaction")
const { addTransactionToExcel } = require("../../interact_excel/interact-transaction-with-exccel")
const { getDataFromExcel } = require("../../interact_excel/interact-transaction-with-exccel")

const tickToken = require("./tic-token.json")
const abi = tickToken.abi
const address = tickToken.address;
const blockNumberDeploy = tickToken.receipt.logs[0].blockNumber;
const blockFilterCurrent = blockNumberDeploy;

//Can only get range heigh block is 1000 
async function getNewTransaction(_from, _to, _value, _fromBlock, _toBlock) {
    const _web3 = web3()
    if (_web3) {
        let contract = new _web3.eth.Contract(abi, address)
        let options = {
            filter: {
                from: _from,
                to: _to,
                value: _value,
            },
            fromBlock: _fromBlock,
            toBlock: _toBlock
        };
        const newTransactions = await getContractTransactions(contract, options, "Transfer")
        return newTransactions
    }

}
async function getAllNewTransactionFromExcel(fileName) {
    const _web3 = web3()
    var allNewTransaction
    const currentBlock = await _web3.eth.getBlockNumber()
    var _fromBlock = blockFilterCurrent
    const data = getDataFromExcel(fileName)
    if (data != -1) {
        const dataLength = Object.keys(data).length
        const blockSaved = data[dataLength - 1].Block
        _fromBlock = blockSaved
    }

    var _toBlock = await updateToBlockFilter()
    console.log("block", _toBlock)
    for (var i = 0; i < 100000; i++) {
        console.log("i", i)
        console.log("thien")

        const newTransactions = await getNewTransaction("0xC7446945830E99389AD2fd29707034f998bF65d8",
        "0x4b023d85601B6101CC6EE073E85A689D521e0B78", [], _fromBlock, _toBlock)
        if(typeof(allNewTransaction) != undefined){
            console.log("yes underfined")
            allNewTransaction = newTransactions
        }else allNewTransaction.push(newTransactions)
        _fromBlock = _toBlock
        _toBlock = await updateToBlockFilter()
        console.log("toBlock", _toBlock)
        console.log("all new transation", allNewTransaction)
        if (_toBlock >= currentBlock) return allNewTransaction
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

async function addNewTransationIntoExcel(fileName) {
    const newTransactions = await getAllNewTransactionFromExcel()
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
    addTransactionToExcel(fileName, newTransactions, workSheetColumnNames, workSheetName)
}
addNewTransationIntoExcel("transaction_of_tic_token.xlsx")
