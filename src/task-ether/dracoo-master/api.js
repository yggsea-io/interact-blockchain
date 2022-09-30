const { default: axios } = require("axios");
const GmailAPI = require("../../common/gmail/GmailApi");
const refreshToken = process.env.REFRESH_TOKEN
const { waitFor } = require('../../common/utils.js')
const accessToken = process.env.ACCESS_TOKEN
class Api {
    constructor(account) {
        this.account = account;
    }

    async login(){
        const signatureReg = await axios.get('https://api.dracoomaster.com/platform/user/signature')
        const signature = this.account.sign(signatureReg.data.message)
        let req = {
            'signature' : signature,
            'message' : signatureReg.data.message,
            'walletAddress' : this.account.address
        }
        const { data } = await axios.post(
            'https://api.dracoomaster.com/platform/user/login',
             req,
             {
                headers: {
                  'content-type': 'application/json'
                }
              }
        )
        return data
    }

    async registerGame(name, mail, pass){
        const login = await this.login()
        const token = login.message.token
        if(
            !(await this.setName(name, token)) || 
            !(await this.checkMail(mail, token)) || 
            !(await this.sendMail(mail, token))
        ) return false

        await waitFor(3000)

        const code = await this.getVerifyCode(mail)
        console.log('code',code)

        if(
            !code ||
            !(await this.verifiMail(mail, code, token)) ||
            !(await !this.bindMail(mail, pass, token))
        ) return false

        return true
    }
    async setName(name, token){
        try {
            const { data } = await axios.post(
                'https://api.dracoomaster.com/platform/user/name/revise',
                { "name": name},
                {
                    headers: {
                      'token': token
                    }
                  }
                )
            if(data.code != "OK"){
                console.log(`Account: ${this.account.address}, Error set name: ${name}`)
                return false
            }
            return true
        } catch (error) {
            console.log(`Account: ${this.account.address}, Error set name: ${name}:  ${error}`)
            return false
        }
    }


    async checkMail(mail, token){
        try {
            const { data } = await axios.post(
                'https://api.dracoomaster.com/platform/mail/check',
                { "email" : mail},
                {
                    headers: {
                      'token': token
                    }
                  }
                )
                if(data.code != 200){
                    console.log(`Account: ${this.account.address}, Error: Check mail be wrong`)
                    return false
                }else if(data.code == 200 && data.msg == 'existence'){
                    console.log(`Account: ${this.account.address}, Error: Mail is existence`)
                    return false
                }
            return true
        } catch (error) {
            console.log(`Account: ${this.account.address}, Error: Check mail be wrong: ${error}`)
            return false
        }
    }

    async sendMail(mail, token){
        try {
            const { data } = await axios.post(
                'https://api.dracoomaster.com/platform/mail/send',
                { "email": mail},
                {
                    headers: {
                      'token': token
                    }
                  }
                )
            if(data.code != 'OK'){
                console.log(`Account: ${this.account.address}, Error: Cannot send mail to get code`)
                return false
            }
            return true
        } catch (error) {
            console.log(`Account: ${this.account.address}, Error: Cannot send mail to get code`)
            return false
        }

    }

    async getVerifyCode(mail){
        try {
            const gmailApi = new GmailAPI(refreshToken, accessToken)
            const messArr = await gmailApi.readInboxContent("from:system@dracooworld.com");
            const mess = messArr.find(mess => mess.payload.headers[0].value == mail)
            const code = mess.snippet.match(/Code [^\s]+/g)[0].replace("Code ","")
            return code            
        } catch (error) {
            console.log(`Account: ${this.account.address}, Error: Cannot get verify code : ${error}`)
            return false
        }
        
    }

    async verifiMail(mail, code, token){
        try {
            const { data } = await axios.post(
                'https://api.dracoomaster.com/platform/mail/verify',
                { "email": mail, "code": code},
                {
                    headers: {
                      'token': token
                    }
                  }
                )
            if(data.code == 'OK' && data.data == '"Repeat Binding"'){
                console.log(`Account: ${this.account.address}, Error: Mail is registed`)
            }else if(data.code != 'OK'){
                console.log(`Account: ${this.account.address}, Error: Cannot verify mail`)
                return false
            }
            return true
        } catch (error) {
            console.log(`Account: ${this.account.address}, Error: Cannot verify mail : ${error}`)
            return false
        }
    }

    async bindMail(mail, pass, token){
        try {
            let params = {
                "email": mail,
                "pwd": pass
            }
            
            params = Buffer.from(encodeURI(JSON.stringify(params))).toString('base64')
            const { data } = await axios.post(
                'https://api.dracoomaster.com/platform/mail/bind',
                { "params": params},
                {
                    headers: {
                      'token': token
                    }
                  }
                )
            if(data.code != 'OK'){
                console.log(`Account: ${this.account.address}, Error: Cannot bind Mail`)
                return false
            }
            return true
        } catch (error) {
            console.log(`Account: ${this.account.address}, Error: Cannot bind Mail : ${error}`)
            return false
        }
    }
}

module.exports = Api;