const axios = require("axios");
const md5 = require("md5");
const protobuf = require('protobufjs');
const { waitFor } = require("../../common/utils");
const WebSocket = require('ws')
var socket = undefined;


async function getTokenAccount(username, password) {
  const { data } = await axios.get("https://web.tapfantasy.io/web/account/login", {
    params: {
        "username": username,
        "password": md5(password),
        "loginType": 2,
    },
  });
  if(data.code != 0){
        console.log('error')
        return undefined
  }
  return data.data.token
}

async function loginGame(token) {
    let req = {
        "channelId": 3,
        "bcID": 56,
        "data" : {
            "token" : token
        }
    };
    const { data } = await axios.post("https://gs1.tapfantasy.io:7101/pflogin",
    req)
    if(data.code){
        return 'false'
    }
    return data
}

async function loginWebsocket(loginRes, bcId){
    const root = await protobuf.load('Tapfantasy.proto');
    const EnterGameInfo = root.lookupType('pb.EnterGameInfo');
    const enterGameBuf = EnterGameInfo.encode({
        id : 13,
        num : 1,
        entergame : { 
            accountId : loginRes.accountId,
            token : loginRes.token,
            name : loginRes.name,
            time : loginRes.time,
            sex : 0,
            nickName : '',
            relogin : '',
            inviteCode : loginRes.inviteCode,
            userId : loginRes.userId,
            bcId : bcId
        }
    }).finish()
    console.log(loginRes.addr)
    const ItemInfo = root.lookupType('pb.ItemInfo');
    const dataReq1 = ItemInfo.encode({id : 105, num : 2, delta : null}).finish()
    const dataReq2 = ItemInfo.encode({id : 301, num : 3, delta : null}).finish()

    const ItemOptionInfo = root.lookupType('pb.ItemOptionInfo');
    const dataReq3 = ItemOptionInfo.encode({id : 407, num : 4, option: { type: 1 }}).finish()


    socket = new WebSocket(loginRes.addr)

    socket.addEventListener('open', (event) => {
        socket.send(enterGameBuf)
        socket.send(dataReq1);
        socket.send(dataReq2);
        socket.send(dataReq3);

    });
    socket.onmessage= function(evt) {
        
    };

    signatureWallet
    
    await waitFor(3000)
    socket.close()
}

async function signatureWallet(hexPrivateKey, message){
    const signingKey = new ethers.utils.SigningKey(hexPrivateKey);
    const digest = ethers.utils.id(message);

    const signature = signingKey.signDigest(digest);
    const joinedSignature = ethers.utils.joinSignature(signature);
    return joinedSignature
}



module.exports = {
    getTokenAccount,
    loginGame,
    loginWebsocket
}
