const { default: axios } = require("axios");

module.exports = async function(uri){
  const { data } = await axios.get(uri);
  var title = "";
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      if(key == 'description' || key == 'image' || key == 'external_url'){
            continue
      } else if (key == "attributes") {
        for (let i = 0; i < data[key].length; i++) {
          title += data[key][i].trait_type + ",";
        }
        continue;
      }else if (key == "collection") {
        title += 'collection: name/family,';
        continue;
      }else if (key == "properties") {
        title += 'creators: address/share';
        continue;
      } else {
        title += key + ",";
      }
    }
  }
  title += "\n";
  return title
}