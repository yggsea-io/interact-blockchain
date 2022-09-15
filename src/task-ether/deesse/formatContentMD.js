const { default: axios } = require("axios");

module.exports = async function(uri){
    const { data } = await axios.get(uri);
    var content = "";
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
        if(key == 'description' || key == 'link'|| key == 'image'){
            continue
        } else if (key == "info") {
            for (let key3 in data[key]) {
            content += data[key][key3] + ",";
            }
            content = content.slice(0, -1)
            continue;
        } else {
            content += data[key] + ",";
        }
        }
    }
    content +=  "\n";
    return content
}