let Web3 = require("web3")
const fs = require('fs')
const { BigNumber } = require('ethers');
require('dotenv').config();

function expandTo18Decimals(n) {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(18))
}

function convert18DecimalsToNomal(n) {
  return BigNumber.from(n).div(BigNumber.from(10).pow(18))
}

const web3 = (eviroment) => {
  const _web3 = new Web3(new Web3.providers.HttpProvider(eviroment));
  return _web3
}

const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));

function AppendDataToFile(filePath, data) {
  fs.appendFile(filePath, data, 'utf8',
    function (err) {
      if (err) throw err;
      console.log("Data appended to file successfully.")
    }
  )
}

module.exports = {
  waitFor,
  web3,
  AppendDataToFile,
  expandTo18Decimals,
  convert18DecimalsToNomal
}
