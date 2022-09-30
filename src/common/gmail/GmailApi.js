var axios = require("axios");
var qs = require("qs");

class GmailAPI {
  accessToken = "";
  refresh_token = undefined
  constructor(refresh_token, accessToken) {
    this.refresh_token = refresh_token;
    this.accessToken = (accessToken != undefined) ? accessToken : this.getAcceToken();
  }

  setAccessToken = async () => {
    var req = {
      'token_uri' : "https://oauth2.googleapis.com/token",
      'refresh_token': this.refresh_token
    };

    const { data } = await axios.post("https://developers.google.com/oauthplayground/refreshAccessToken", req)
    if(data.error != undefined){
        console.log(`Err: ${error}`)
        return this.accessToken
    }
    return data.access_token; 
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
