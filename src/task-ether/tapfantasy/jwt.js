const crypto = require('crypto')
const Hash = require("hash")
const header = {
    "alg": "HS256",
    "typ": "JWT"
}
const body = {
    "data": {
        "openId": "kieudaithien1",
        "token": "ZbXNCGEH"
    },
    "exp": 1661916435,
    "iat": 1661830035
}

const createSignature =(jwtB64Header,jwtB64Payload,secret)=>{
    // create a HMAC(hash based message authentication code) using sha256 hashing alg
        let signature = crypto.createHmac ('sha256', secret);
    
    // use the update method to hash a string formed from our jwtB64Header a period and 
    //jwtB64Payload 
        signature.update (jwtB64Header + '.' + jwtB64Payload);
    
    //signature needs to be converted to base64 to make it usable
        signature = signature.digest ('base64');
    
    //of course we need to clean the base64 string of URL special characters
        signature = replaceSpecialChars (signature);
        return signature
}

const replaceSpecialChars = b64string => {
    // create a regex to match any of the characters =,+ or / and replace them with their // substitutes
      return b64string.replace (/[=+/]/g, charToBeReplaced => {
        switch (charToBeReplaced) {
          case '=':
            return '';
          case '+':
            return '-';
          case '/':
            return '_';
        }
      });
    };

const headerB64 = replaceSpecialChars(Buffer.from(JSON.stringify(header)).toString('base64'))
const bodyB64 = replaceSpecialChars(Buffer.from(JSON.stringify(body)).toString('base64'))
console.log("body64", bodyB64);

const secret = crypto.randomBytes(64).toString("hex");
console.log("secret", secret)

const signature =  createSignature(headerB64, bodyB64, secret)
console.log(signature)
console.log('result', headerB64 + "." + bodyB64 + "." + signature)