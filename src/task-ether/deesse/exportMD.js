const { default: axios } = require('axios');
const { AppendDataToFile, runMutiThreadForLoop } = require('../../common/utils');
const formatContent = require('./formatContentMD')
runMutiThreadForLoop(60, 1, exportmd).catch( err => console.log(err))
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
          AppendDataToFile('deesse1.txt', item.tokenId + ',' + content)
        }
        page += 1
    } while (dataHandle != "[]" && page < endPage);
}
