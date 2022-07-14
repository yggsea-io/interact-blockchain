var Web3 = require('web3')
const { web3 } = require("../utils")
const { appendDataTofile } = require('../utils')
const { waitFor } = require("../utils")
const { getContractTransactions } = require("./interract-transaction")


let latestKnownBlockNumber = -1;
let blockTime = 5000;

//funtion action for block
async function saveNewTransaction(contract, options, filePath) {
    const _web3 = web3()
    const currentBlockNumber = await _web3.eth.getBlockNumber()
    while (latestKnownBlockNumber == -1 || currentBlockNumber > latestKnownBlockNumber) {
        //liten new block to perform action
        await saveTransactionToFile(latestKnownBlockNumber == -1 ? currentBlockNumber : latestKnownBlockNumber + 1,
            contract, options, filePath);
    }
    await waitFor(3000)
    setTimeout(saveNewTransaction, blockTime, contract, options, filePath);
}

//end funtion action for block


async function saveTransactionToFile(blockNumber, contract, options, filePath) {
    console.log("Proceesing to block: ", blockNumber)
    try {
        options.fromBlock = blockNumber  
        options.toBlock = blockNumber
    } catch (error) {
        console.log(error)
    }
    const newTransaction = await getContractTransactions(contract, options, "Transfer")
    console.log("new transaction", JSON.stringify(newTransaction))
    if (JSON.stringify(newTransaction) != "[]") {
        console.log("Found out new transaction in this block " + blockNumber + "\n", newTransaction)
        const data = (" - " + "From: " + newTransaction[0].returnValues.from
            + ", To:" + newTransaction[0].returnValues.to
            + ", Value: " + newTransaction[0].returnValues.value
            + ", transaction hash: " + newTransaction[0].transactionHash
            + ", block number: " + newTransaction[0].transactionHash)
        console.log("convert data to append file: ", data)

        appendDataTofile(filePath, data)
    } else console.log("No transaction to save")
    latestKnownBlockNumber = blockNumber;
}

module.exports = {
    saveNewTransaction
}
