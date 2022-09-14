const { default: axios } = require("axios");
const { AppendDataToFile } = require("../../common/utils");

(async () => {
  const { data } = await axios.get(
    "https://mirror-api.mirrorwrld.io/api/v1/nft/property/FU1tDd78JKyLqDT6jRUhgLkxdnuYu1Z9nJL2QfwjtWuv/123/MRM"
  );
  var dataHandle = data.data;
  var title = "";
  var content = "";
  for (var key in dataHandle) {
    if (dataHandle.hasOwnProperty(key)) {
      if (key == "skills") {
        for (let i = 0; i < dataHandle[key].length; i++) {
          title += "skill" + i + ",";
          content += JSON.stringify(dataHandle[key][i]) + ",";
        }
        continue;
      } else if (key == "status") {
        for (let i = 0; i < dataHandle[key].length; i++) {
          title += dataHandle[key][i].trait_type + ",";
          content +=
            dataHandle[key][i].value + "/" + dataHandle[key][i].icon + ",";
        }
        continue;
      } else if (key == "honor") {
        for (let key3 in dataHandle[key]) {
          title += key3 + ",";
          content += dataHandle[key][key3] + ",";
        }
        continue;
      } else {
        title += key + ",";
        content += dataHandle[key] + ",";
      }
    }
  }
  title += "trace_id" + "\n";
  content += data.trace_id + "\n";
  AppendDataToFile("token-123.txt", title + content);
})();
