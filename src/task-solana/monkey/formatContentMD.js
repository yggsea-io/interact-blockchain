const { default: axios } = require("axios");

module.exports = async function(uri){
  const { data } = await axios.get(uri);
  var content = "";
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      if(key == 'description' || key == 'image' || key == 'external_url'){
            continue
      } else if (key == "attributes") {
        for (let i = 0; i < data[key].length; i++) {
          content +=
          data[key][i].value + ",";
        }
        continue;
      }else if (key == "collection") {
        content += data[key].name + "/" + data[key].family + ','
        continue;
      }else if (key == "properties") {
        content += data[key].creators[0].address + "/" + data[key].creators[0].share
        continue;
      } else {
        content += data[key] + ",";
      }
    }
  }
  content += "\n";
  return content
}
