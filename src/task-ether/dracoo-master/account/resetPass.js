require("../../../common/ether/network").useBSC()
const path = require('path')
const fs = require('fs')
const { readData, writeData } = require("../../../common/excel/csv")
const { runMutiThreadForLoop, sortIncrease } = require("../../../common/utils")
const Api = require('./api')
const SUCCESS_PATH = path.join(__dirname, './reset-pass-success.txt')

main().catch(err => console.log(err))
async function main(){
    const accountsRegisted = await readData(path.join(__dirname, './resgister-success.txt'))
    await runMutiThreadForLoop(accountsRegisted.length, 0, register, accountsRegisted)
    let dataSuccess = await readData(SUCCESS_PATH)
    dataSuccess = sortIncrease(dataSuccess, 'id')
    const header = ['id', 'address', 'gmail', 'password']
    await writeData(dataSuccess, header, path.join(__dirname, './reset-pass-success.csv'))
}

async function register(start, end, data){
    for(let i = start; i< end; i++){
        let api = new Api(data[i].address)
        const idGmail = data[i].gmail.match(/: [^\s]+/g)[0].replace(": ", "")
        const resetPass = await api.resetPass(idGmail, data[i].gmail, data[i].password)
    }
}