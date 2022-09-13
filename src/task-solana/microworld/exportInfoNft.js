const { AppendDataToFile } = require("../../common/utils")

const { getDataFromFileTxt } = require("../../common/utils");

(async()=>{
    var data = await getDataFromFileTxt('Microworld.txt')
    //data = JSON.parse(data)
    for(let item of data){
        itemdata = JSON.parse(item)
        var txtAppend = itemdata.name 
        for(let ab of itemdata.attributes){
            txtAppend += ',' + JSON.stringify(ab)
        }
        txtAppend += "\n"
        AppendDataToFile("info-nft.txt", txtAppend)
    }
})()