const { getMetadataFromAllNft, getAllNftByOwner } = require("../../../common/solana/nft")

const { AppendDataToFile, getDataFromFileTxt } = require("../../../common/utils");

(async()=>{
    await getMetadataFromAllNft('hc5YHg5a1nDpSEi6iwio5cHS8T2Zi1YWX8VqxmsG9b3','MIRROR')
    
    var data = await getDataFromFileTxt('Microworld.txt')
    //data = JSON.parse(data)
    for(let item of data){
        itemdata = JSON.parse(item)
        var txtAppend = itemdata.name 
        for(let ab of itemdata.attributes){
            txtAppend += ',' + JSON.stringify(ab)
        }
        txtAppend += "\n"
        AppendDataToFile("info-metadata-list.txt", txtAppend)
    }
})()