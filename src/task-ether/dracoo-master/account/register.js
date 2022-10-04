require("../../../common/ether/network").useBSC()
const path = require('path')
const { readData } = require("../../../common/excel/csv")
const { runMutiThreadForLoop } = require("../../../common/utils")
const Api = require('./api')
const GmailAPI = require("../../../common/gmail/GmailApi");
require('dotenv').config({ path: path.join(__dirname, '../../../../.env') });
const gmailApi = new GmailAPI(process.env.REFRESH_TOKEN_MAIL, process.env.ACCESS_TOKEN_MAIL);


main().catch(err => console.log(err))
async function main(){
    const accounts = await readData(path.join(__dirname, './account.txt'))
    const deleteDracoo = await gmailApi.deleteGmailFrom("workspace-noreply@google.com");
    await runMutiThreadForLoop(accounts.length, 0, register, accounts)
}

async function register(start, end, data){
    for(let i = start; i< end; i++){
        let api = new Api(data[i].address, gmailApi)
        const regiter = await api.registerGame(`yggsea${id}`, `dracoobinding+${id}@yggsea.io`)
    }
}
