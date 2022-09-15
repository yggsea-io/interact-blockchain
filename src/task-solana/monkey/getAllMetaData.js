const { getAllNftByOwner } = require("../../common/solana/nft")

const { AppendDataToFile } = require("../../common/utils");
const getFormatTileMD = require("./formatTitleMD")
const getContentTileMD = require("./formatContentMD")

async function getMetadataFromAllNft(){
    const nft = await getAllNftByOwner('2jAq7j7L8hPPXwVoY4GfbNxuQLN2kpxxQr2ZyerXaZ8o')
    console.log('nft',nft)
    let title = undefined
    const result = []
    for (let item of nft) {
        if (item.symbol != 'ML') continue;
        if(title == undefined){
            title = await getFormatTileMD(item.uri)
            AppendDataToFile('monkey.txt', title)
        }
        const content = await getContentTileMD(item.uri)
        AppendDataToFile('monkey.txt', content)
    }
    return result
}
getMetadataFromAllNft()