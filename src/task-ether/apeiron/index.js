const { default: axios } = require("axios")
const { getTokenUri721 } = require("../../common/ether/nft")
const { readData } = require("../../common/excel/csv")
const { AppendDataToFile } = require("../../common/utils")

main().catch(err => console.log(err))
async function main(){

    const massBreed = await readData('from-0x653ed919c2f4e7e550744d07d06630cd10c1bf0f.csv')
    const coreNfts = await readData('from-0x6015cd342826e52fc8650fbb1b351d8d5e44c88b.csv')

    const promise = []
    promise.push(appendData('massBreed.txt', massBreed))
    promise.push(appendData('coreNFTs.txt', coreNfts))
    Promise.all(promise)

}

async function appendData(file, data){
    for(let item of data){
        const uri = await getTokenUri721('0x24f9b0837424c62d2247d8a11a6d6139e4ab5ed2', 	item.Token_ID)
        console.log(uri)
        const { data } = await axios.get(uri)
        let result = item.Token_ID + ','
        for(let item of data.attributes){
            if(item.trait_type == 'Born Time' || item.trait_type == 'Primeval Legacy'){
                continue
            }
            result += item.value + ","
        }
        AppendDataToFile(file, result + "\n")
    }
}