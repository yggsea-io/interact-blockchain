const { web3 } = require("../lib/utils")
const { convert18DecimalsToNomal } = require("../lib/utils")
const abi = require("./abi/erc20.json");
const { readData, writeData } = require("../lib/excel/csv/csv.js.js");
const address = "0x200C234721b5e549c3693CCc93cF191f90dC2aF9";
const _web3 = web3("https://bsc-dataseed.binance.org")

async function exportCSV() {
    if (_web3) {
        let contract = new _web3.eth.Contract(abi, address)
        let data1 = await readData ("./DR07.csv", 2);
        let data2 = await readData("./DR23.csv", 2);
        let result = []

        for (var i = 0; i < 100; i++) {
            let item = []
            item.push(data1[i][2])
            item.push(data1[i][0])
            item.push(data2[i][0])
            var balance = await contract.methods.balanceOf(data1[i][2]).call()
            balance = parseInt(convert18DecimalsToNomal(balance).toNumber())
            var total = parseInt(data1[i][0]) + parseInt(data2[i][0]) 
            item.push(balance)

            var check = false
            if (total == balance) {
                check = true
            }
            item.push(check)
            result.push(item)
        }
        const header = ['address', 'amount1', 'amount2', 'balance', 'check']
        writeData(result, header, "out.csv")
    }

}
exportCSV()