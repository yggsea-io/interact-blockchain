const { getMetadataByOwner } = require("../../../common/solana/nft")

const { AppendDataToFile } = require("../../../common/utils");

main().catch(err => console.log(err)) 

async function main(){
    let data = await getMetadataByOwner('hc5YHg5a1nDpSEi6iwio5cHS8T2Zi1YWX8VqxmsG9b3','MIRROR')
    console.log(data)
    for(let item of data){
        itemdata = JSON.parse(item)
        var txtAppend = itemdata.name 
        for(let ab of itemdata.attributes){
            txtAppend += ',' + JSON.stringify(ab)
        }
        txtAppend += "\n"
        AppendDataToFile("info-metadata-list.txt", txtAppend)
     }
}