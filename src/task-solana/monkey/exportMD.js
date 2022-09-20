const { getAllNftByOwner } = require("../../common/solana/nft")

const { AppendDataToFile, runMutiThreadForLoop } = require("../../common/utils");
const getFormatTileMD = require("./formatTitleMD")
const getContentTileMD = require("./formatContentMD");
let isExistTitle = false
main().catch(err => console.log(err))
async function exportMd(start, end, nfts){
    for (let i = start ; i < end; i ++) {
        if (nfts[i].symbol != 'ML') continue;
        if(isExistTitle == false){
            isExistTitle = true
            title = await getFormatTileMD(nfts[i].uri)
            AppendDataToFile('monkey1.txt', title)
        }
        const content = await getContentTileMD(nfts[i].uri)
        AppendDataToFile('monkey1.txt', content)
    }
}

async function main(){
    const nfts = await getAllNftByOwner('2jAq7j7L8hPPXwVoY4GfbNxuQLN2kpxxQr2ZyerXaZ8o')
    runMutiThreadForLoop(nfts.length, 0, exportMd, nfts)
}
