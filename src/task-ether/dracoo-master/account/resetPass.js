require("../../../common/ether/network").useBSC()
const path = require('path')
const { readData } = require("../../../common/excel/csv")
const { runMutiThreadForLoop } = require("../../../common/utils")
const Api = require('./api')

main().catch(err => console.log(err))
async function main(){
    const accountsRegisted = await readData(path.join(__dirname, './resgister-success.txt'))
    await runMutiThreadForLoop(accountsRegisted.length, 0, register, accountsRegisted)

    // let api = new Api('0x6F502dB203017Ea6d3c0156726a0dFCd480bEf59')
    // const resetPass = await api.resetPass('dracoobinding+10@yggsea.io','dXfhOzXS')

}

async function register(start, end, data){
    for(let i = start; i< end; i++){
        let api = new Api(data[i].address)
        const resetPass = await api.resetPass(data[i].gmail, data[i].password)
    }
}