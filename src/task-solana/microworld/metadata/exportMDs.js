const { getMetadataByOwner } = require("../../../common/solana/nft")

const { AppendDataToFile, runMutiThreadForLoop } = require("../../../common/utils");

main().catch(err => console.log(err)) 

async function main(){
    let data = await getMetadataByOwner('hc5YHg5a1nDpSEi6iwio5cHS8T2Zi1YWX8VqxmsG9b3','MIRROR')
    runMutiThreadForLoop(data.length, 0, readMdToFile, data)
}

async function readMdToFile(start, end, data){
    for(let i = start; i< end; i++){
        itemdata = JSON.parse(data[i])
        var txtAppend = itemdata.name 
        for(let ab of itemdata.attributes){
            txtAppend += ',' + JSON.stringify(ab)
        }
        txtAppend += "\n"
        AppendDataToFile("info-metadata-list.txt", txtAppend)
     }
}