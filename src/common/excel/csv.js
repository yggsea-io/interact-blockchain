const fs = require("fs");
const fastcsv = require('fast-csv');
const csv = require('csv-parser');

async function readData(file) {
    const rs = [];
    const reader = fs.createReadStream(file)
        .pipe(csv())
        .on('data', (row) => { rs.push(row) })
    return new Promise((res, rej) =>
        reader.on('end', () => res(rs)).on('error', err => rej(err))
    )
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