require("../../../common/ether/network").useBSC()
const path = require('path')
const { readData, writeData } = require("../../../common/excel/csv")
const { runMutiThreadForLoop, sortIncrease } = require("../../../common/utils")
const Api = require('./api')
const GmailAPI = require("../../../common/gmail/GmailApi");
require('dotenv').config({ path: path.join(__dirname, '../../../../.env') });
const fs = require('fs')
const gmailApi = new GmailAPI(process.env.REFRESH_TOKEN_MAIL, process.env.ACCESS_TOKEN_MAIL);
const SUCCESS_PATH = path.join(__dirname, './resgister-success.txt')


main().catch(err => console.log(err))
async function main(){
    // const accounts = await readData(path.join(__dirname, './account.txt'))
    // try {
    //     const deleteDracoo = await gmailApi.deleteGmailFrom("from:system@dracooworld.com");
    // } catch (error) {
        
    // }
    // await runMutiThreadForLoop(accounts.length, 0, register, accounts)
    let dataSuccess = await readData(SUCCESS_PATH)
    dataSuccess = sortIncrease(dataSuccess, 'id')
    const header = ['id', 'address', 'gmail', 'password']
    await writeData(dataSuccess, header, path.join(__dirname, './resgister-success.csv'))
}

async function register(start, end, data){
    for(let i = start; i< end; i++){
        let api = new Api(data[i].address, gmailApi)
        const id = data[i].id
        const regiter = await api.registerGame(id,`yggsea${id}`, `dracoobinding+${id}@yggsea.io`)
    }
}
