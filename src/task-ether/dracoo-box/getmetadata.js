const { AppendDataToFile } = require("../../../src/common/utils");
const axios = require("axios");
require("../../common/ether/network").useBSC()
const tokenContract = "0xb5039cf6099770e47de760c9a0dc1c75c489e519"


async function getNFTMetadata() {
    var promises = []

    for(let item of data){
        if(item.To.toLowerCase() != '0xadd96A9B6afd85639e1FAcFeDD8C7836064f14Cd'.toLowerCase()){
            continue;
        }   
        try {
            var uriMedata = await contract.methods.tokenURI(item.TokenId).call()
            console.log(uriMedata)
            promises.push(appendData(uriMedata))
        } catch (error) {
            AppendDataToFile("tokenIdErr.txt", item.TokenId + "\n")
        }
    }
    await Promise.all(promises)
}
 async function appendData(uri){
    metadata = await axios.get(uri)
    const result = item.TokenId + "," + metadata.name + "," + JSON.stringify(metadata) + "\n"
    AppendDataToFile("result.txt", result)
 }

getNFTMetadata()