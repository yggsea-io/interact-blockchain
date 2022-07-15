const xlsx = require("xlsx")
const path = require("path");

function addTransactions(filePath, transactions, workSheetColumnNames, workSheetName) {
    console.log("transations", transactions)
    if(typeof(transactions == undefined)){
        return
    }
    const data = transactions.map(tran => {
        return [
            tran.returnValues.from,
            tran.returnValues.to,
            tran.returnValues.value,
            tran.transactionHash,
            tran.blockNumber
        ]
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
module.exports = {
    addTransactions
}