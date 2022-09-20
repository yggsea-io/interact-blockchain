const { default: axios } = require("axios");
const { AppendDataToFile, runMutiThreadForLoop } = require("../../../common/utils");
const formatContent = require("./formatContentMrm");
const formatTitle = require("./formatTitleMrm");
let titleExist = false;

runMutiThreadForLoop(1045, 0, exportMd).catch((err) => console.log(err))

async function exportMd(start, end) {
  var dataHandle = [];
  var offset = start;
  let limit = 10
  do {
    const { data } = await axios.get(
      "https://api.solscan.io/account/v2/tokenaccounts",
      {
        params: {
          address: "hc5YHg5a1nDpSEi6iwio5cHS8T2Zi1YWX8VqxmsG9b3",
          offset: offset,
          limit: limit,
        },
      }
    );
    dataHandle = data.data;
    if (titleExist == false) {
      titleExist = true;
      title = await formatTitle(
        `https://mirror-api.mirrorwrld.io/api/v1/nft/property/FU1tDd78JKyLqDT6jRUhgLkxdnuYu1Z9nJL2QfwjtWuv/${dataHandle[0].tokenName.replace(
          "Mirrors #",
          ""
        )}/MRM`
      );
      AppendDataToFile("nft-mrm1.txt", title);
    }
    for (let item of dataHandle) {
      const tokenid = item.tokenName.replace("Mirrors #", "");
      const uriMedata = `https://mirror-api.mirrorwrld.io/api/v1/nft/property/FU1tDd78JKyLqDT6jRUhgLkxdnuYu1Z9nJL2QfwjtWuv/${tokenid}/MRM`;
      const content = await formatContent(uriMedata);
      AppendDataToFile("nft-mrm1.txt", content);
    }
    offset += 10;
    limit = (offset + 10 > end ) ? (end - offset) : 10
  } while (dataHandle != "[]" && offset <= end);
  console.log("end run:", start, end);
}
