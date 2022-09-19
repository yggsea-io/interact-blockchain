const { Metaplex } = require("@metaplex-foundation/js");
const { Connection, clusterApiUrl } = require("@solana/web3.js");
const connection = new Connection(clusterApiUrl("mainnet-beta"));
const axios = require("axios");
const { AppendDataToFile, getDataFromFileTxt } = require("../utils");
const fs = require('fs')
const path = require('path')
const RESULT_PATH = path.join(__dirname, './result.txt')


async function getAllNftByOwner(owner){
    const metaplex = new Metaplex(connection)
    const nft = await metaplex.nfts().findAllByOwner({owner}).run();
    return nft
    
}
async function getMetadataByOwner(owner, symbol){
    const nfts = await getAllNftByOwner(owner)
    console.log('length',nfts.length)
    const heighStartEnd = parseInt(nfts.length / 10) + 1
    var promises = [];
    var start = 0, end = heighStartEnd
    for(let i = 0 ; i < 10 ; i++){
        promises.push(getMetaDataFromUri(nfts, start, end, symbol))
        start = end;
        end = (heighStartEnd + end > nfts.length) ? (nfts.length) : (heighStartEnd + end)
    }
    await Promise.all(promises)
    let result = await getDataFromFileTxt(RESULT_PATH)
    fs.unlinkSync(RESULT_PATH)
    return result
}
async function getMetaDataFromUri(nfts, fromId, toId, symbol){
    const result = []
    for (let i = fromId ; i< toId ; i++) {
        if (nfts[i].symbol != symbol) continue;
        const { data } = await axios.get(nfts[i].uri)
        metadata = data

        //------Task for apeen file
        // const tokenId = metadata.attributes[1].value
        // const level = metadata.attributes[2].value
        // const infoItem = tokenId + "," + level + "\n"
        AppendDataToFile(RESULT_PATH, JSON.stringify(metadata) + "\n")
       result.push(metadata)
    }
    return result
}

module.exports = {
  getAllNftByOwner,
  getMetadataByOwner
}