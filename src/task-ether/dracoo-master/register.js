require("../../common/ether/network").useBSC()
const Api = require('./api')
const Account = require('../../common/ether/account.js')


main().catch(err => console.log(err))
async function main(){
    const account = new Account("0xa5D5762482f5b28a9884F90963E2952dF36a354e", '18289a61cddcbb885b613ee5c1fcd10774e74589a61ce4a695fa3dda7961614c')
    const api = new Api(account)
    const register = await api.registerGame('kieudaithien', 'kieudaithien5@gmail.com', '12345678')
    if(register) console.log(`Success: ${account.address}`)
}