const { default: axios } = require("axios");
const { waitFor } = require("../../../common/utils");

const appendDataMrm = require("./format-nft-mrm");

(async () => {
  var dataHandle = [];
  var offset = 0
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
      console.log(dataHandle.length)
      for (let item of dataHandle) {
        const tokenid = item.tokenName.replace("Mirrors #", "");
        const uriMedata = `https://mirror-api.mirrorwrld.io/api/v1/nft/property/FU1tDd78JKyLqDT6jRUhgLkxdnuYu1Z9nJL2QfwjtWuv/${tokenid}/MRM`;
        appendDataMrm(uriMedata);
      }
      offset += 50
      console.log(offset)
  } while (dataHandle != "[]");
  console.log('end')
})();
