const abi721 = require('./abis/Erc721.json')
require("../../common/ether/network").usePolygon()
const { web3 } = require("../../common/ether/network").getConfig();

const getTokenUri721 = async (contractAd, tokenId) => {
    const contract = new web3.eth.Contract(abi721, contractAd)
    var  tokenUri = await contract.methods.tokenURI(tokenId).call()
    return tokenUri
}

module.exports = {
    getTokenUri721
}