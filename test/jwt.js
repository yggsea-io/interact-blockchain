const crypto = require("crypto");
const Hash = require("hash");
const jwt = require("jsonwebtoken");
const header = {
  alg: "HS256",
  typ: "JWT",
};
var ts = new Date().getTime();
ts = parseInt(ts / 1000);
const body = {
  data: {
    openId: "tuilaken85",
    token: "dYKMB55N",
  },
  exp: 1662436801,
  iat: 1662350401, // iat + 86400
};
console.log("body", body);

const createSignature = (jwtB64Header, jwtB64Payload, secret) => {
  // create a HMAC(hash based message authentication code) using sha256 hashing alg
  let signature = crypto.createHmac("sha256", secret);
  // use the update method to hash a string formed from our jwtB64Header a period and
  //jwtB64Payload
  signature.update(jwtB64Header + "." + jwtB64Payload);
  //signature needs to be converted to base64 to make it usable
  signature = signature.digest("base64");
  //of course we need to clean the base64 string of URL special characters
  signature = replaceSpecialChars(signature);
  return signature;
};

const replaceSpecialChars = (b64string) => {
  // create a regex to match any of the characters =,+ or / and replace them with their // substitutes
  return b64string.replace(/[=+/]/g, (charToBeReplaced) => {
    switch (charToBeReplaced) {
      case "=":
        return "";
      case "+":
        return "-";
      case "/":
        return "_";
    }
  });
};

const headerB64 = replaceSpecialChars(
  Buffer.from(JSON.stringify(header)).toString("base64")
);
const bodyB64 = replaceSpecialChars(
  Buffer.from(JSON.stringify(body)).toString("base64")
);

const secret =
  "96894c4d5ea6235e919ffa907a35d75364db1073966598fc025d6ac4a5523bee93c086cf03d8067a9bdc5990b79b2203a70661f88eef8334a07b2d0693280d5c";

const signature = createSignature(headerB64, bodyB64, secret);
const fulltoken = headerB64 + "." + bodyB64 + "." + signature;

console.log("result1", fulltoken);

const token = jwt.sign(
  {
    data: { openId:"tuilaken85", token :"dYKMB55N" },
  },
  secret,
  {
    expiresIn: "1d",
  }
);

console.log("result2", token);
console.log("verify", jwt.verify(token, secret));
