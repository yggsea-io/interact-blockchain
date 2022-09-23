const { default: axios } = require("axios");
var GmailAPI = require("../../common/gmail/GmailApi");
const credentials = require('./credentials.json')
const refreshToken = "1//0eKuWyCp3ZS6LCgYIARAAGA4SNwF-L9Irjtz6uLzD-savhr6YmBjvLEzQDnkFN323vFeEvUcUbyeCcBlobbGOe0o8xEIikMgfxVI"
const qs = require('qs');

main().catch(err => console.log(err))
async function main(){
    const req = {
        'email': 'kieudaithien2@gmail.com'
    }
    let { data } =  await axios.post('https://gfc-dashboard.azurewebsites.net/user/request/password', req)
     const user = new GmailAPI(credentials, refreshToken)
    const mess = await user.readInboxContent("from:playeraccounts@playfab.com");
    const rex = /token[^\s]+/g;
    const tokenResetPass = mess[0].snippet.match(rex)[0].replace("token=","")
    console.log(tokenResetPass)
    let params = {
        Token : tokenResetPass,
        Password : '123456',
        Password2: '123456'
    }
    const resetPass = await axios.post('https://player.playfab.com/Account/ResetTitlePassword', qs.stringify(params))
    console.log(resetPass.data)
}