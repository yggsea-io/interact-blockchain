const { Metaplex } = require("@metaplex-foundation/js");
const { Connection, clusterApiUrl, Keypair } = require("@solana/web3.js");
const connection = new Connection(clusterApiUrl("mainnet-beta"));
const axios = require("axios");
const base58 = require("bs58");
const { AppendDataToFile, waitFor } = require("../utils");


async function getAllNftByOwner(owner){
    const metaplex = new Metaplex(connection)
    const nft = await metaplex.nfts().findAllByOwner({owner}).run();
    return nft
    
}
async function getMetadataFromAllNft(owner, symbol){
    const nft = await getAllNftByOwner(owner)
    const result = []
    for (let item of nft) {
        if (item.symbol != symbol) continue;
        const { data } = await axios.get(item.uri)
        metadata = data
        console.log(metadata)

        //------Task for apeen file
        // const tokenId = metadata.attributes[1].value
        // const level = metadata.attributes[2].value
        // const infoItem = tokenId + "," + level + "\n"
        //AppendDataToFile("microworld-metadata-uris.txt", JSON.stringify(metadata) + "\n")
       result.push(metadata)
    }
    return result
}

module.exports = {
  getAllNftByOwner,
  getMetadataFromAllNft
}