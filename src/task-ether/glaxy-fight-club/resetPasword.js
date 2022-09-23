const { default: axios } = require("axios");
var GmailAPI = require("../../common/gmail/GmailApi");
const credentials = require('./credentials.json')
const refreshToken = "1//0eKuWyCp3ZS6LCgYIARAAGA4SNwF-L9Irjtz6uLzD-savhr6YmBjvLEzQDnkFN323vFeEvUcUbyeCcBlobbGOe0o8xEIikMgfxVI"
const qs = require('qs');
const { AppendDataToFile } = require('../../../src/common/utils.js')

module.exports = async function(mail, pass, comfirmPass){
    try {
        if(!checkInputisValid(pass, comfirmPass)){
            AppendDataToFile('reset-pass-fail.txt', mail + "," + 'err: password not match' + "\n")
            return
        }
        let { data } =  await axios.post('https://gfc-dashboard.azurewebsites.net/user/request/password', { 'email': mail})
         const user = new GmailAPI(credentials, refreshToken)
        const messArr = await user.readInboxContent("from:playeraccounts@playfab.com");
        const mess = messArr.find(mess => mess.payload.headers[0].value == mail)
        if(mess == undefined){
            AppendDataToFile('reset-pass-fail.txt', mail + ', err: not find token in mail' + "\n")
            return 
        }
        const tokenResetPass = mess.snippet.match(/token[^\s]+/g)[0].replace("token=","")
       
        let params = {
            Token : tokenResetPass,
            Password : pass,
            Password2: comfirmPass
        }
        const resetPass = await axios.post('https://player.playfab.com/Account/ResetTitlePassword', qs.stringify(params))
        
        if(!resetPass.data.includes("Your password for 'Galaxy Fight Club' has been updated.")){
            AppendDataToFile('reset-pass-fail.txt', mail + "," + 'err: fail call api reset pass' + "\n")
        }
        AppendDataToFile('reset-pass-success.txt', mail + "," + pass + ',' + comfirmPass + "\n")
        console.log(resetPass.data)
        return resetPass.data
    } catch (error) {
        AppendDataToFile('reset-pass-fail.txt', mail + "," + error + "\n")
    }
    
}

function checkInputisValid(pass, comfirmPass){
    if(pass != comfirmPass){
        console.log('passwork not match')
        return false
    }
    return true
}
