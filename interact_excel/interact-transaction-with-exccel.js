const xlsx = require("xlsx")
const path = require("path");

function addTransactionToExcel(filePath, transactions, workSheetColumnNames, workSheetName) {
    const data = transactions.map(tran => {
        return [tran.returnValues.from,
        tran.returnValues.to,
        tran.returnValues.value,
        tran.transactionHash,
        tran.blockNumber]
    })
    const workbook = xlsx.utils.book_new();
    const workSheetData = [
        workSheetColumnNames,
        ...data
    ]
    const workSheet = xlsx.utils.aoa_to_sheet(workSheetData)
    xlsx.utils.book_append_sheet(workbook, workSheet, workSheetName)
    xlsx.writeFile(workbook, path.resolve(filePath))
    return true
}

function getDataFromExcel(fileName){
    try {
        var workbook = xlsx.readFile(fileName)
    } catch (error) {
        return -1
    }
    var sheet_name_list = workbook.SheetNames;
    var transaction;
    sheet_name_list.forEach(function(y) {
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
        transaction = data
    });
    return transaction
}
module.exports = {
    addTransactionToExcel,
    getDataFromExcel
}