
let Web3 = require("web3")
const fs = require('fs')
require('dotenv').config();
const eviroment = process.env.EVIROMENT_MUMBAI;
const web3 = () => {
  const _web3 = new Web3(new Web3.providers.HttpProvider(eviroment));
  return _web3
}
const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));

function appendDataTofile(filePath, data) {
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
  appendDataTofile
}
