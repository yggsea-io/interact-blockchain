require("../../../common/ether/network").useBSC()
const path = require('path')
const { readData } = require("../../../common/excel/csv")
const { runMutiThreadForLoop } = require("../../../common/utils")
const Api = require('./api')

main().catch(err => console.log(err))
async function main(){
    const accountsRegisted = await readData(path.join(__dirname, './resgister-success.txt'))
    await runMutiThreadForLoop(accountsRegisted.length, 0, register, accountsRegisted)
}

async function register(start, end, data){
    for(let i = start; i< end; i++){
        let api = new Api(data[i].address)
        const idGmail = data[i].gmail.match(/: [^\s]+/g)[0].replace(": ", "")
        const resetPass = await api.resetPass(idGmail, data[i].gmail, data[i].password)
    }
}