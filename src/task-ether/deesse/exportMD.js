const { default: axios } = require('axios');
const { AppendDataToFile } = require('../../common/utils');
const formatContent = require('./formatContentMD')
main().catch( err => console.log(err))
async function main(){
    var dataHandle = [];
    var page = 45
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
          AppendDataToFile('deesse3.txt', item.tokenId + ',' + content)
        }
        page += 1 
    } while (dataHandle != "[]");
}