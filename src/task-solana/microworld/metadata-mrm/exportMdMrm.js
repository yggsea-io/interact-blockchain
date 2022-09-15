const { default: axios } = require("axios");
const { AppendDataToFile } = require("../../../common/utils");
const formatContent  = require('./formatContentMrm')
const formatTitle  = require('./formatTitleMrm')


main().catch( err => console.log(err))
async function main(){
  var dataHandle = [];
  var offset = 0
  let title = undefined
  do {
    const { data } = await axios.get(
        "https://api.solscan.io/account/v2/tokenaccounts",
        {
          params: {
            "address": "hc5YHg5a1nDpSEi6iwio5cHS8T2Zi1YWX8VqxmsG9b3",
            "offset": offset,
            "limit": 50,
          },
        }
      );
      dataHandle = data.data
      if(title == undefined) {
        title = await formatTitle(`https://mirror-api.mirrorwrld.io/api/v1/nft/property/FU1tDd78JKyLqDT6jRUhgLkxdnuYu1Z9nJL2QfwjtWuv/${dataHandle[0].tokenName.replace("Mirrors #", "")}/MRM`)
        AppendDataToFile('nft-mrm.txt', title)
      }
      for (let item of dataHandle) {
        const tokenid = item.tokenName.replace("Mirrors #", "");
        const uriMedata = `https://mirror-api.mirrorwrld.io/api/v1/nft/property/FU1tDd78JKyLqDT6jRUhgLkxdnuYu1Z9nJL2QfwjtWuv/${tokenid}/MRM`;
        const content = await formatContent(uriMedata);
        AppendDataToFile('nft-mrm.txt', content)
      }
      offset += 50
      console.log(offset)
  } while (dataHandle != "[]");
  console.log('end')
}
