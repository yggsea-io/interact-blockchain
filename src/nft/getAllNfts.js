const axios = require('axios');
const { AppendDataToFile, waitFor } = require("../../lib/utils")

const apiKey = "BhC1-Caq1J4CsOBRFRF3kDI51RRDsYVb"
// replace with your Alchemy api key
const baseURL = `https://polygon-mainnet.g.alchemy.com/nft/v2/${apiKey}/getNFTs/`;
// replace with the wallet address you want to query for NFTs
const ownerAddr = "0xE1D48Dd54E6F02014E48B230cbc1730eBb36F235";
var pageKey = ""
const contractAddr = "0x60ce73cF71Def773a7a8199D4e6B2F237D5a6b32";
async function getTokenIdFromWallet(){
    do {
        var url = `${baseURL}?owner=${ownerAddr}&contractAddresses[]=${contractAddr}&pageKey=${pageKey}`
        if(pageKey == ""){
            url = `${baseURL}?owner=${ownerAddr}&contractAddresses[]=${contractAddr}`
        }
        var config = {
            method: 'get',
            url: url
        };
        axios(config)
            .then(response => {
                var data = JSON.stringify(response.data, null, 2)
                data = JSON.parse(data)
                var result = "";
                for (var i = 0; i < 100; i++) {
                    try {
                        result += data.ownedNfts[i].metadata.tokenId + "\n"
                    } catch (error) {
                    }
                }
                pageKey = data.pageKey
                AppendDataToFile("tokenid.txt", result)
            })
            .catch(error => console.log(error));
            await waitFor(3000)
    } 
    while (pageKey != undefined)
}
getTokenIdFromWallet()
