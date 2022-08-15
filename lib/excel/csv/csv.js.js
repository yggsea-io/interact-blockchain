const fs = require("fs");
const fastcsv = require('fast-csv');
const { parse } = require("csv-parse");

async function readData(file, fromline) {
    let data = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(file)
            .pipe(parse({ delimiter: ",", from_line: fromline }))
            .on('data', function (row) {
                data.push(row)
            })
            .on('end', () => {
                resolve(data);
            })
            .on('error', error => {
                reject(error);
            });
    });
}
//header is array string
async function writeData(data, header, filepath){
    const ws = fs.createWriteStream(filepath);
    fastcsv
        .write(data, { headers: header})
        .pipe(ws);
}
module.exports = {
    readData,
    writeData
}