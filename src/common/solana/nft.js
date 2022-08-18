const { Metaplex , keypairIdentity, bundlrStorage} = require("@metaplex-foundation/js");
const { Connection, clusterApiUrl, Keypair } = require("@solana/web3.js");
const connection = new Connection(clusterApiUrl("mainnet-beta"));
const axios = require("axios");
const base58 = require("bs58");
const { AppendDataToFile } = require("../utils");


async function getAllNftByOwner(owner){
    const wallet = Keypair.generate();
     const metaplex = new Metaplex(connection)
        .use(keypairIdentity(wallet))
        .use(bundlrStorage());
    const nft = await metaplex.nfts().findAllByOwner(owner).run();
    return nft
    
}
async function getMetadataFromAllNft(owner, symbol){
    const nft = await getAllNftByOwner(owner)
    const result = []
    for (let item of nft) {
        if (item.symbol == symbol) continue;
        var metadata = item.uri
        do{
            try {
                const { data } = await axios.get(item.uri)
                metadata = data
            } catch (error) {
                metadata = undefined
            }
        }while(metadata == undefined)

        //------Task for apeen file
        // const tokenId = metadata.attributes[1].value
        // const level = metadata.attributes[2].value
        // const infoItem = tokenId + "," + level + "\n"
        AppendDataToFile("HABITAT.txt", infoItem)
        result.push(metadata)
    }
    return result
}

async function getMetadataFromAllNft2(owner, symbol){
    const nft = await getAllNftByOwner(owner)
    const result = []
    for (let item of nft) {
        if (item.symbol != symbol) continue;
        console.log(`${item.name},${item.uri}`)
    }
    return result
}

module.exports = {
  getAllNftByOwner,
  getMetadataFromAllNft,
  getMetadataFromAllNft2
}