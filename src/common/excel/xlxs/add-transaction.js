const xlsx = require("xlsx")
const path = require("path");

function setDataToFile(filePath, data, workSheetColumnNames, workSheetName) {
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
    setDataToFile
}