const fs = require("fs");
const { BigNumber } = require("ethers");
const LineByLine = require("line-by-line");
const crypto = require('crypto')

function expandTo18Decimals(n) {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(18));
}

function convert18DecimalsToNomal(n) {
  return BigNumber.from(n).div(BigNumber.from(10).pow(18));
}

const waitFor = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

function AppendDataToFile(filePath, data) {
  fs.appendFile(filePath, data, "utf8", function (err) {
    if (err) throw err;
    //console.log("Data appended to file successfully.")
  });
}

function getDataFromFileTxt(filePath) {
  const lr = new LineByLine(filePath);
  let rs = [];
  lr.on("line", (line) => {
    rs.push(line.trim());
  });
  return new Promise((res, rej) =>
    lr.on("end", () => res(rs)).on("error", (err) => rej(err))
  );
}

async function runMutiThreadForLoop(totalItem, startNum, actionFunc, data) {
  var heigh = parseInt(totalItem / 10) + 1;
  const promises = [];
  var start = startNum,
    end = heigh;
  for (let i = 0; i < 10; i++) {
    console.log("start run:", start, end);
    promises.push(actionFunc(start, end, data));
    start = end;
    end = heigh + end > totalItem ? totalItem : heigh + end;
  }
  await Promise.all(promises);
}

const generatePassword = (
  length = 20,
  wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-'
) => Array.from(crypto.randomFillSync(new Uint32Array(length))).map((x) => wishlist[x % wishlist.length]).join('')

module.exports = {
  waitFor,
  AppendDataToFile,
  expandTo18Decimals,
  convert18DecimalsToNomal,
  getDataFromFileTxt,
  runMutiThreadForLoop,
  generatePassword
};
