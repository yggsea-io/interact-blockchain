const { default: axios } = require("axios");
var GmailAPI = require("../../common/gmail/GmailApi");
const refreshToken = "1//0eKuWyCp3ZS6LCgYIARAAGA4SNwF-L9Irjtz6uLzD-savhr6YmBjvLEzQDnkFN323vFeEvUcUbyeCcBlobbGOe0o8xEIikMgfxVI"
const qs = require('qs');
const { AppendDataToFile } = require('../../../src/common/utils.js')

module.exports = async function(mail, pass, confirmPass){
    try {
        if(!checkInputisValid(pass, confirmPass)){
            AppendDataToFile('reset-pass-fail.txt', mail + "," + 'err: password not match' + "\n")
            return
        }
        const tokenResetPass = await getTokenForResetPass(mail)
        console.log('token',tokenResetPass)
        if(tokenResetPass == false) return 
        resetPass(mail, tokenResetPass, pass, confirmPass)
        
    } catch (error) {
        console.log('tets')
        AppendDataToFile('reset-pass-fail.txt', mail + "," + error + "\n")
    }
    
}

async function resetPass(mail, tokenResetPass, pass, confirmPass){
    let params = {
        Token : tokenResetPass,
        Password : pass,
        Password2: confirmPass
    }
    const resetPass = await axios.post('https://player.playfab.com/Account/ResetTitlePassword', qs.stringify(params))
    
    if(!resetPass.data.includes("Your password for 'Galaxy Fight Club' has been updated.")){
        AppendDataToFile('reset-pass-fail.txt', mail + "," + 'err: fail call api reset pass' + "\n")
    }
    AppendDataToFile('reset-pass-success.txt', mail + "," + pass + ',' + confirmPass + "\n")
    console.log(resetPass.data)
    return resetPass.data
}

async function getTokenForResetPass(mail){
    let { data } =  await axios.post('https://gfc-dashboard.azurewebsites.net/user/request/password', { 'email': mail})
    const user = new GmailAPI(credentials, refreshToken)
   const messArr = await user.readInboxContent("from:playeraccounts@playfab.com");
   const mess = messArr.find(mess => mess.payload.headers[0].value == mail)
   if(mess == undefined){
       AppendDataToFile('reset-pass-fail.txt', mail + ', err: not find token in mail' + "\n")
       return false
   }
   const tokenResetPass = mess.snippet.match(/token[^\s]+/g)[0].replace("token=","")
   return tokenResetPass
}

function checkInputisValid(pass, confirmPass){
    if(pass != confirmPass){
        console.log('passwork not match')
        return false
    }
    return true
}
