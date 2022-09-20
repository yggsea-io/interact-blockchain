const fs = require('fs')
const { BigNumber } = require('ethers');
const LineByLine = require('line-by-line');

function expandTo18Decimals(n) {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(18))
}

function convert18DecimalsToNomal(n) {
  return BigNumber.from(n).div(BigNumber.from(10).pow(18))
}

const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));

function AppendDataToFile(filePath, data) {
  fs.appendFile(filePath, data, 'utf8',
    function (err) {
      if (err) throw err;
      //console.log("Data appended to file successfully.")
    }
  )
}

function getDataFromFileTxt(filePath) {
  const lr = new LineByLine(filePath);
  let rs = [];
  lr.on('line', (line) => {
      rs.push(line.trim());
  });
  return new Promise((res, rej) => lr.on('end', () => res(rs)).on('error', err => rej(err)));
}

module.exports = {
  waitFor,
  AppendDataToFile,
  expandTo18Decimals,
  convert18DecimalsToNomal,
  getDataFromFileTxt
}
