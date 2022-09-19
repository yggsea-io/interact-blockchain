const { default: axios } = require('axios');
const { AppendDataToFile } = require('../../common/utils');
const formatContent = require('./formatContentMD')
main(60).catch( err => console.log(err))
async function exportmd(startPage, endPage){
    var dataHandle = [];
    var page = startPage
    do {
      const { data } = await axios.get(
          "https://api.deesse.art/auction/nft/list",
          {
            params: {
              "holder": "0xd77e6952d6af6d0b989439d3a7a95400d41a249f",
              "page": page,
              "size": 100,
            },
          }
        );
        dataHandle = data.data.rows
        for (let item of dataHandle) {
          const uriMedata = item.tokenUrl;
          const content = await formatContent(uriMedata);
          AppendDataToFile('deesse.txt', item.tokenId + ',' + content)
        }
        page += 1
    } while (dataHandle != "[]" && page < endPage);
}

async function main(totalPage){
    var heighStartEnd = parseInt(totalPage /10 + 1)
    const promises = [];
    var start = 1, end = heighStartEnd
    for(let i = 0 ; i < 10 ; i++){
        promises.push(exportmd(start, end))
        start = end;
        end += heighStartEnd
    }
    await Promise.all(promises)
}