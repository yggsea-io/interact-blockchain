require("../../common/ether/network").usePolygon()
const { getTokenUri721 } = require("../../common/ether/nft")
const { readData } = require("../../common/excel/csv")
const path = require('path')
const { default: axios } = require("axios")
const { AppendDataToFile, runMutiThreadForLoop, waitFor } = require("../../common/utils")


main().catch(error => console.log(error))

let attributesUnicorn = []
let attributesUniF = []

async function addUnicorns(tokenId){
    let metadata = undefined
    while(metadata == undefined){
        try {
            const tokenUri = await getTokenUri721('0xdc0479cc5bba033b3e7de9f178607150b3abce1f', tokenId)
            console.log(tokenId, tokenUri)
            metadata = await axios.get(tokenUri)
            metadata = metadata.data
        } catch (error) {
            metadata = undefined
        }
    }
    let result = metadata['token_id'] + ","

    for(let item of attributesUnicorn){
        const attributes  = metadata.attributes.find((i) => i.trait_type == item)     
        if(attributes){
            result += attributes.value + ","
        }else{
            result += ","
        }
    }
    //AppendDataToFile('Unicorns.txt', result.substring(0, result.length - 1) + "\n")
    waitFor(100)

}

async function addUnif(tokenId){
    let metadata = undefined
    while(metadata == undefined){
        try {
            const tokenUri = await getTokenUri721('0xa2a13ce1824f3916fc84c65e559391fc6674e6e8', tokenId)
            console.log(tokenId, tokenUri)
            metadata = await axios.get(tokenUri)
            metadata = metadata.data
        } catch (error) {
            metadata = undefined
        }
    }
    let result = metadata['token_id'] + ","

    for(let item of attributesUniF){
        const attributes  = metadata.attributes.find((i) => i.trait_type == item)     
        if(attributes){
            result += attributes.value + ","
        }else{
            result += ","
        }
    }

    //AppendDataToFile('Unif.txt', result.substring(0, result.length - 1) + "\n")

}
async function exportMetadata(start, end, nfts){
    for(let i = start; i < end; i ++){
        if(nfts[i].TokenSymbol == "UNICORNS"){
            addUnicorns(nfts[i].TokenId)
        }
        if(nfts[i].TokenSymbol == "UNIF"){
            addUnif(nfts[i].TokenId)
        }
    }
}

async function getTransactionNfts(to){
    const result = []    
    const nfts = await readData(path.join(__dirname, './nfts.csv'))
    console.log('nfts:', nfts.length)
    
    for(let item of nfts){
        const checkExist = result.find(i => (i.TokenId == item.TokenId && i.TokenSymbol == item.TokenSymbol))
        if(!checkExist){
            result.push(item)
        }else{
            if(item.to != to){
                var index = result.findIndex(v => v.TokenId == item.TokenId);
                result.splice(index, index >= 0 ? 1 : 0);
            }

        }
    }
    return result
}
async function main(){
    const uri = await getTokenUri721('0xdc0479cc5bba033b3e7de9f178607150b3abce1f', 5849)    
    const metadataUnicorn  = await axios.get(uri)
    let titleUnicorn = "Token Id,"   
    for(let item of metadataUnicorn.data.attributes){
        attributesUnicorn.push(item.trait_type)
        titleUnicorn += item.trait_type + ","
    }
    //AppendDataToFile('Unicorns.txt', titleUnicorn.substring(0, titleUnicorn.length - 1) + "\n")
    const uri2 = await getTokenUri721('0xa2a13ce1824f3916fc84c65e559391fc6674e6e8', 18175)
    const metadataUnif   = await axios.get(uri2)
    let titleUniF = "Token Id,"    
    for(let item of metadataUnif.data.attributes){
        attributesUniF.push(item.trait_type)
        titleUniF += item.trait_type + ","
    }
    // AppendDataToFile('Unif.txt', titleUniF.substring(0, titleUnicorn.length - 1) + "\n")
    const nfts = await getTransactionNfts('0xbedc1a821adbbfd76133d3aa7f0a9ae8a4a9edf7')    
    await runMutiThreadForLoop(nfts.length, 0 , exportMetadata, nfts)
}
