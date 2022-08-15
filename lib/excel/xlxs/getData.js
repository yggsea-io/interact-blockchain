const xlsx = require("xlsx")
const path = require("path");

function getDataFromFile(fileName){
    try {
        var workbook = xlsx.readFile(fileName)
    } catch (error) {
        console.log(error)
        return -1
    }
    var sheet_name_list = workbook.SheetNames;
    var result;
    sheet_name_list.forEach(function getData(y) {
        var worksheet = workbook.Sheets[y];
        var headers = {};
        var data = [];
        for(z in worksheet) {
            if(z[0] === '!') continue;
            //parse out the column, row, and value
            var tt = 0;
            for (var i = 0; i < z.length; i++) {
                if (!isNaN(z[i])) {
                    tt = i;
                    break;
                }
            };
            var col = z.substring(0,tt);
            var row = parseInt(z.substring(tt));
            var value = worksheet[z].v;
    
            //store header names
            if(row == 1 && value) {
                headers[col] = value;
                continue;
            }
    
            if(!data[row]) data[row]={};
            data[row][headers[col]] = value;
        }
        //drop those first two rows which are empty
        data.shift();
        data.shift();
        result = data
    });
    return result
}
module.exports = {
    getData
}