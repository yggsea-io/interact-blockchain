const { default: axios } = require("axios");

module.exports = async function(uri){
  const { data } = await axios.get(uri);
  var dataHandle = data.data;
  var content = "";
  for (var key in dataHandle) {
    if (dataHandle.hasOwnProperty(key)) {
      if(key == 'grade_icon' || key == 'next_grade_icon'){
          continue
      } else if (key == "skills") {
        for (let i = 0; i < dataHandle[key].length; i++) {
          for(let key2 in dataHandle[key][i]){
            if(key2 == 'image_path') continue
            content += dataHandle[key][i][key2] + "/";
          }
          content.slice(0, -1)
          content += ','
        }
        continue;
      } else if (key == "status") {
        for (let i = 0; i < dataHandle[key].length; i++) {
          content +=
            dataHandle[key][i].value + ",";
        }
        continue;
      } else if (key == "honor") {
        for (let key3 in dataHandle[key]) {
          content += dataHandle[key][key3] + ",";
        }
        continue;
      } else {
        content += dataHandle[key] + ",";
      }
    }
  }
  content += data.trace_id + "\n";
  return content
}
