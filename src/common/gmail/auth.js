const fs = require("fs");
const qs = require('qs');
const { google } = require("googleapis");
const credentials = require("./credentials.json");
const { default: axios } = require("axios");
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

function getCode() {
  const { client_secret, client_id, redirect_uris } = credentials.web;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
}
async function getRefreshToken(code) {
  let req = {
    'code': code,
    'client_id': credentials.web.client_id,
    'client_secret': credentials.web.client_secret,
    'redirect_uri': credentials.web.redirect_uris[0],
    'grant_type': "authorization_code",
  };
  console.log(qs.stringify(req))

  const options = {
    method: 'POST',
    data: qs.stringify(req),
    url: 'https://accounts.google.com/o/oauth2/token',
  };

  let { data } = axios(options).catch(err => console.log(err))
  console.log('data', data);
}
getRefreshToken(
  "4/0ARtbsJr15h7qtOvMbzTE_3_SeHgodscWWjJO5jlI2r0w8jcrW-Kpqvl9A13SL8MpDhdUeQ&scope=https://www.googleapis.com/auth/gmail.readonly"
).catch(err => console.log(err));
//getCode().catch(err => console.log(err));
