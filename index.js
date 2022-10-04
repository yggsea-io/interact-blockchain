require('./src/common/ether/network.js').usePolygon()
const { web3 } = require('./src/common/ether/network.js').getConfig()
const Erc20Abi  = require('./src/common/ether/abis/Erc20.json')
main().catch(err => console.log(err))
async function main(){
    const contract = new  web3.eth.Contract(Erc20Abi, "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0")
    const total = await contract.methods.totalSupply().call()
    console.log('total', total)
}