const { default: axios } = require('axios');
const api = require('./api');
const protobuf = require('protobufjs');
const { AppendDataToFile } = require('../../common/utils');
run().catch( err => {console.log(err)})
async function run() {
    const tokenAccount = await api.getTokenAccount('kieudaithien1', "Thien1997*")
    if(tokenAccount == 0){
        return console.log("error")
    }
    const requestLoginToken = await axios.get(
        'https://www.tapfantasy.io/game/bsc?token='
         + tokenAccount 
         + '&bcid=56&lang=en')
    var loginToken = requestLoginToken.request.path
                        .replace('/bsc/game.html?token=', '')
                        .replace('&bcid=56','')
    
    const loginHttpRes = await api.loginGame(loginToken)
    const loginWSRes = await api.loginWebsocket(loginHttpRes, 56)
    //console.log(loginWSRes.toString())
}