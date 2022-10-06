require('./src/common/ether/network.js').useBSCTestnet()
const { web3 } = require('./src/common/ether/network.js').getConfig()
const erc20Abi = require('./src/common/ether/abis/Erc20.json')
const { expandTo18Decimals } = require('./src/common/utils.js')

const erc2OTest = new web3.eth.Contract(erc20Abi, '0x0dD728c7A8Fd532820aA950b1aD59D37cA1C9B7A',{
    from: '0xD6feF2ea5dC76F95B1222C5c29abf481CE2724bf'
})

main().catch(err => console.log(err))
async function main(){
    const add1 = await web3.eth.accounts.wallet.add('323002e24c5289146349110b7609fc48854daaf6bdb52a7e753a79ddd4b75189')
    const add2 =  await web3.eth.accounts.wallet.add('46f0304e59fafe98eeb12b8753e4224e47bae0313bac164907346173e1adfaec')
    const transaction = await erc2OTest.methods.transfer(
        '0xD6feF2ea5dC76F95B1222C5c29abf481CE2724bf',
        expandTo18Decimals(1000)
        ).send({
            from : '0x45Fb368d78b5cD9A353Cc72C1F6A10eFb5cD47d1',
            gas: 40000,
            gasPrice : bvhsghs
        })
    console.log('transaction',transaction)
}