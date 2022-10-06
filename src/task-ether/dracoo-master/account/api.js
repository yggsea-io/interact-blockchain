const { default: axios } = require("axios");
const { generatePassword, AppendDataToFile } = require("../../../common/utils");
const { waitFor } = require("../../../common/utils.js");
const { dracooMasterSign } = require("../cybavo-api");

const path = require("path");

const FAIL_REGISTER_PATH = path.join(__dirname, "./resgister-fail.txt");
const SUCCESS_REGISTER_PATH = path.join(__dirname, "./resgister-success.txt");
const FAIL_RESET_PASS_PATH = path.join(__dirname, "./reset-pass-fail.txt");
const SUCCESS_RESET_PASS_PATH = path.join(__dirname, "./reset-pass-success.txt");

class Api {
  constructor(addWallet, gmailApi) {
    this.address = addWallet;
    this.gmailApi = gmailApi;
    this.id = undefined;
    this.mail = undefined;
    this.name = undefined;
    this.token = undefined;
  }

  async login() {
    const signatureReg = await axios.get(
      "https://api.dracoomaster.com/platform/user/signature"
    );
    const signatureRes = await dracooMasterSign(
      this.address,
      signatureReg.data.message
    );
    let req = {
      signature: signatureRes.data.signature,
      message: signatureReg.data.message,
      walletAddress: this.address,
    };
    const { data } = await axios.post(
      "https://api.dracoomaster.com/platform/user/login",
      req,
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );
    return data;
  }

  async registerGame(id, name, mail) {
    this.id = id
    this.mail = mail;
    this.name = name;
    const loginData = await this.login();
    this.token = loginData.message.token;
    if (
      !(await this.setName()) ||
      !(await this.checkMail()) ||
      !(await this.sendMail())
    )
      return false;

    //Start get code
    await waitFor(2000);
    let code;
    for (let i = 0; i < 5; i++) {
      await waitFor(1000);
      code = await this.getVerifyCode();
      if (code == false || code == undefined) continue;
      break;
    }
    if (code == false || code == undefined) {
      AppendDataToFile(
        FAIL_REGISTER_PATH,
        `${this.id},${this.address},${this.mail},Error: Cannot get verify code.Please get token to read mail again\n`
      );
    }

    //End get code

    if (!code || !(await this.verifiMail(code)) || !(await this.bindMail()))
      return false;

    return true;
  }
  async setName() {
    try {
      const { data } = await axios.post(
        "https://api.dracoomaster.com/platform/user/name/revise",
        { name: this.name },
        {
          headers: {
            token: this.token,
          },
        }
      );
      if (data.code != "OK") {
        AppendDataToFile(
          FAIL_REGISTER_PATH,
          `${this.id},${this.address},${this.mail},Error set name: ${this.name}\n`
        );
        return false;
      }
      return true;
    } catch (error) {
      console.log(
        AppendDataToFile(
          FAIL_REGISTER_PATH,
          `${this.id},${this.address},${this.mail},Error set name: ${this.name}: ${error}\n`
        )
      );
      return false;
    }
  }

  async checkMail() {
    try {
      const { data } = await axios.post(
        "https://api.dracoomaster.com/platform/mail/check",
        { email: this.mail },
        {
          headers: {
            token: this.token,
          },
        }
      );
      if (data.code != 200) {
        AppendDataToFile(
          FAIL_REGISTER_PATH,
          `${this.id},${this.address},${this.mail},Error: Check mail be wrong \n`
        );
        return false;
      } else if (data.code == 200 && data.msg == "existence") {
        AppendDataToFile(
          FAIL_REGISTER_PATH,
          `${this.id},${this.address},${this.mail},Error: Mail is existence \n`
        );
        return false;
      }
      return true;
    } catch (error) {
      AppendDataToFile(
        FAIL_REGISTER_PATH,
        `${this.id},${this.address},${this.mail},Error: Check mail be wrong: ${error} \n`
      );
      return false;
    }
  }

  async sendMail() {
    try {
      const { data } = await axios.post(
        "https://api.dracoomaster.com/platform/mail/send",
        { email: this.mail },
        {
          headers: {
            token: this.token,
          },
        }
      );
      if (data.code != "OK") {
        AppendDataToFile(
          FAIL_REGISTER_PATH,
          `${this.id},${this.address},${this.mail},Error: Cannot send mail to get code \n`
        );
        return false;
      }
      return true;
    } catch (error) {
      AppendDataToFile(
        FAIL_REGISTER_PATH,
        `${this.id},${this.address},${this.mail},Error: Cannot send mail to get code \n`
      );
      return false;
    }
  }

  async getVerifyCode() {
    try {
      const messArr = await this.gmailApi.readInboxContent(
        "from:system@dracooworld.com"
      );
      const mess = messArr.find((mess) =>
        mess.payload.headers.find(
          (header) => header.value == this.mail && header.name == "To"
        )
      );
      const code = mess.snippet.match(/Code [^\s]+/g)[0].replace("Code ", "");
      console.log(`${this.mail}code:`, code);
      return code;
    } catch (error) {
      return false;
    }
  }

  async verifiMail(code) {
    try {
      const { data } = await axios.post(
        "https://api.dracoomaster.com/platform/mail/verify",
        { email: this.mail, code: code },
        {
          headers: {
            token: this.token,
          },
        }
      );
      console.log(`verify mail ${this.mail} with ${code}: ${data}`);
      if (data.code == "OK" && data.data == true) {
        return true;
      } else if (data.code == "OK" && data.data == '"Repeat Binding"') {
        AppendDataToFile(
          FAIL_REGISTER_PATH,
          `${this.id},${this.address},${this.mail},Error: Mail is registed \n`
        );
      } else {
        AppendDataToFile(
          FAIL_REGISTER_PATH,
          `${this.id},${this.address},${this.mail},Error: Cannot verify mail, maybe error code \n`
        );
        return false;
      }
    } catch (error) {
      AppendDataToFile(
        FAIL_REGISTER_PATH,
        `${this.id},${this.address},${this.mail},Error: Cannot verify mail : ${error} \n`
      );
      return false;
    }
  }

  async bindMail() {
    const pass = generatePassword(8);
    console.log("pass", pass);
    try {
      let params = {
        email: this.mail,
        pwd: pass,
      };

      params = Buffer.from(encodeURI(JSON.stringify(params))).toString(
        "base64"
      );
      const { data } = await axios.post(
        "https://api.dracoomaster.com/platform/mail/bind",
        { params: params },
        {
          headers: {
            token: this.token,
          },
        }
      );
      console.log("bind mail", data);

      if (data.code != "OK") {
        AppendDataToFile(
          FAIL_REGISTER_PATH,
          `${this.id},${this.address},${this.mail},${pass},Error: Cannot bind Mail \n`
        );
        return false;
      } else if (data.code == "OK") {
        AppendDataToFile(
          SUCCESS_REGISTER_PATH,
          `${this.id},${this.id},${this.address},${this.mail},${pass} \n`
        );
      }
      return true;
    } catch (error) {
      AppendDataToFile(
        FAIL_REGISTER_PATH,
        `${this.id},${this.address},${this.mail},${pass},Error: Cannot bind Mail : ${error}\n`
      );
      return false;
    }
  }

  async resetPass(id ,mail, oldPass) {
    this.id = id
    this.mail = mail;
    const loginData = await this.login();
    this.token = loginData.message.token;
    const newPass = generatePassword(8);
    while (newPass == oldPass) {
      newPass = generatePassword(8);
    }
    try {
      let params = {
        oldPwd: oldPass,
        pwd: newPass,
      };

      params = Buffer.from(encodeURI(JSON.stringify(params))).toString(
        "base64"
      );
      const { data } = await axios.post(
        "https://api.dracoomaster.com/platform/user/password/revise",
        { params: params },
        {
          headers: {
            token: this.token,
            "content-type": "application/json"
          },
        }
      );
      console.log("reset pass", data, this.mail);

      if (data.code == "OK" && data.data == true) {
        AppendDataToFile(
          SUCCESS_RESET_PASS_PATH,
          `${this.id},${this.address},${this.mail},${newPass}\n`
        );
        return false;
      } else {
        AppendDataToFile(
          FAIL_RESET_PASS_PATH,
          `${this.id},${this.address},${this.mail},${oldPass},${newPass}\n`
        );
      }
      return true;
    } catch (error) {
      AppendDataToFile(
        FAIL_RESET_PASS_PATH,
        `${this.id},${this.address},${this.mail},${oldPass},${newPass}\n`
      );
      return false;
    }
  }
}

module.exports = Api;
