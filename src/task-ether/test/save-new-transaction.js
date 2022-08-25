require("../../common/ether/network").useBSCTestnet()
const { getDataEvent } = require("../../common/ether/event")
const { waitFor } = require("../../common/utils")
const { web3 } = require("../../common/ether/network").getConfig()
const TestAddress = "0x14105552460E2dD3Ff4E5a1F28DA79c53AF04C43"
const TestAbi = require("./abi/TEST.json")
const TestContract = new web3.eth.Contract(TestAbi, TestAddress)

let latestKnownBlock = -1;

async function listenNewEventToSave(blockNumber) {
    var options = {
        fromBlock : blockNumber,
        toBlock : blockNumber
    }
    console.log("Proceesing to block: ", blockNumber)
    const newEvent = await getDataEvent(TestContract, options, "Transfer")
    console.log("new event", JSON.stringify(newEvent))
    saveEventToServer

    latestKnownBlock = blockNumber;
}

async function saveEventToServer(){

}

async function main() {
    const currentBlockNumber = await web3.eth.getBlockNumber()

    while (latestKnownBlock == -1 || currentBlockNumber > latestKnownBlock) {
        //liten new block to perform action
        await listenNewEventToSave(
            latestKnownBlock == -1 ? currentBlockNumber : latestKnownBlock + 1);
    }
    await waitFor(3000)
    setTimeout(main);
}

main()