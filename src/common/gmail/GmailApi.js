var axios = require("axios");
var qs = require("qs");

class GmailAPI {
  accessToken = "";
  refresh_token = undefined
  constructor(credentials, refresh_token) {
    this.refresh_token = refresh_token;
    this.accessToken = this.getAcceToken(credentials);
  }

  getAcceToken = async (credentials) => {
    var data = qs.stringify({
      client_id: credentials.web != undefined ?  credentials.web.client_id :  credentials.installed.client_id,
      client_secret: credentials.web != undefined ?  credentials.web.client_secret :  credentials.installed.client_secret,
      // refresh_token: (this.refresh_token != undefined && this.refresh_token != '') ? this.refresh_token 
      //                           : get,
      refresh_token: this.refresh_token, 
      grant_type: "refresh_token",
    });
    var config = {
      method: "post",
      url: "https://accounts.google.com/o/oauth2/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    let accessToken = "";

    await axios(config)
      .then(async function (response) {
        accessToken = await response.data.access_token;
      })
      .catch(function (error) {
        console.log(error);
      });

    return accessToken;
  };

  searchGmail = async (searchItem) => {
    var config1 = {
      method: "get",
      url:
        "https://www.googleapis.com/gmail/v1/users/me/messages?q=" + searchItem,
      headers: {
        Authorization: `Bearer ${await this.accessToken} `,
      },
    };
    var idMess = "";

    await axios(config1)
      .then(async function (response) {
        idMess = await response.data["messages"];
      })
      .catch(function (error) {
        console.log(error);
      });

    return idMess;
  };

  readGmailContent = async (messageId) => {
    var config = {
      method: "get",
      url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
      headers: {
        Authorization: `Bearer ${await this.accessToken}`,
      },
    };

    var data = {};

    await axios(config)
      .then(async function (response) {
        data = await response.data;
      })
      .catch(function (error) {
        console.log(error);
      });

    return data;
  };

  readInboxContent = async (searchText) => {
    const messIds = await this.searchGmail(searchText);
    let messages = []
    
    for(let item of messIds){
      const mess = await this.readGmailContent(item.id);
      messages.push(mess)
    }
    return messages;
  };
}

module.exports = GmailAPI;
