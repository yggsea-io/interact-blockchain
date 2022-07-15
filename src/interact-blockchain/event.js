var Web3 = require('web3')
const { web3 } = require('../../lib/utils')
const { appendDataTofile } = require('../../lib/utils')
const { waitFor } = require('../../lib/utils')

let latestKnownBlockNumber = -1;
let blockTime = 5000;

const getDataEvent = async (contract, options, eventName) => {
    const data = await contract.getPastEvents(eventName, options)
    .then(result => {
        return result
    })
    .catch(err => console.log('error', err.message, err.stack));
    return data
  
}

// eventFields must is array string
async function saveNewEventToFile(contract, eventName, eventFieldNames, options, filePath) {
    const _web3 = web3()
    const currentBlockNumber = await _web3.eth.getBlockNumber()

    while (latestKnownBlockNumber == -1 || currentBlockNumber > latestKnownBlockNumber) {
        //liten new block to perform action
        await listenNewEventToSave(latestKnownBlockNumber == -1 ? currentBlockNumber : latestKnownBlockNumber + 1,
            contract, eventName, eventFieldNames, options, filePath);
    }
    await waitFor(3000)
    setTimeout(saveNewEventToFile, blockTime, contract, eventName, eventFieldNames ,options, filePath);
}

async function listenNewEventToSave(blockNumber, contract, eventName, eventFieldNames, options, filePath) {
    console.log("Proceesing to block: ", blockNumber)
    options.fromBlock = blockNumber
    options.toBlock = blockNumber
    const newEvent = await getDataEvent(contract, options, eventName)
    if (JSON.stringify(newEvent) != "[]") {
        console.log("Found out new transaction in this block " + blockNumber)
        var data = "\n - "
        const dataFields = newEvent[0].returnValues
        for(var i = 0 ; i < eventFieldNames.length ; i ++){
            const dataField = dataFields[0]
            data += eventFieldNames[i] + ": " + dataField + ", "
        }
        data += 'transaction hash: ' + newEvent[0].transactionHash + ", "
             + 'block: ' + newEvent[0].blockNumber
        console.log("data", data)
        appendDataTofile(filePath, data)
    } else{
        console.log("No transaction to save")
    } 
    
    latestKnownBlockNumber = blockNumber;
}

module.exports = {
    getDataEvent,
    saveNewEventToFile
}