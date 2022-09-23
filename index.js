require("./src/common/ether/network").usePolygon()
const { web3 } = require("./src/common/ether/network").getConfig();
const tokenContract = "0xa2a13ce1824f3916fc84c65e559391fc6674e6e8"
const WebSocket = require('ws')


const tokenURIABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",  
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
const contract = new web3.eth.Contract(tokenURIABI, tokenContract)


async function getNFTMetadata() {
  const ages = [3, 10, 28, 20];

   
  let age = ages.find(age => checkAge(parseInt(age)));
  console.log(age);
}
 
function checkAge(age) {
  return age > 100;
}
getNFTMetadata()