const { readData } = require("./src/common/excel/csv");
const { AppendDataToFile } = require("./src/common/utils");
const axios = require("axios");
require("./src/common/ether/network").useBSC()
const { web3 } = require("./src/common/ether/network").getConfig();
const tokenContract = "0xb8726809f9a9c059b8454cdf6b37dc20dd52e982"
const contract = new web3.eth.Contract(tokenURIABI, tokenContract)

const tokenURIABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",  
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

async function getNFTMetadata() {

    const data = await readData('export-address-token-nft.csv')

    for(let item of data){
        if(data.To != '0xadd96A9B6afd85639e1FAcFeDD8C7836064f14Cd'){
            continue;
        }
        var metadata = await contract.methods.tokenURI(item.TokenId).call()
        do{
            try {
                const { data } = await axios.get(metadata)
                metadata = data
            } catch (error) {
                metadata = undefined
            }
        }while(metadata == undefined)
        const result = item.TokenId + "," + metadata.name + "," + JSON.stringify(metadata) + "\n"
        AppendDataToFile("result.txt", result)

    }
}

getNFTMetadata()