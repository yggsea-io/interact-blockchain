const fs = require("fs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const axios = require("axios");
const { v4: uuid } = require("uuid");


const baseURL = `http://54.254.174.135`
const apiKey = "e1d1e7a1-c007-4f89-9cb7-6fe177577375";
const privateKey = '/Users/kieuthien/private.key';
const axiosInstance = axios.create({ baseURL });

const createToken = (path, body) => jwt.sign({
    uri: path,
    nonce: uuid(),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 55,
    sub: apiKey,
    bodyHash: crypto.createHash("sha256").update(JSON.stringify(body)).digest().toString("hex")
}, fs.readFileSync(privateKey), { algorithm: "RS256" });

const createHeader = (path, body) => ({
    "Authorization": `Bearer ${createToken(path, body)}`,
    "X-API-Key": apiKey,
});

const post = (path, body) => axiosInstance.post(path, body, { headers: createHeader(path, body) });
const get = (path, body) => axiosInstance.get(path, { headers: createHeader(path, body) });

const dracooMasterSign = (account, message) => {
    const path = `/dracoo-master/sign/${account}`;
    const body = { message };
    return post(path, body);
}

module.exports = {
    dracooMasterSign
}


