const fs = require('fs');
const { web3, convert18DecimalsToNomal } = require('../../../lib/utils')
const erc721Abi = require('../../../src/abi/erc721.json')
const erc20Abi = require('../../../src/abi/erc20.json')
require('dotenv').config();
const eviroment_polygon = process.env.EVIROMENT_POLYGON;
const _web3 = web3(eviroment_polygon)

const UNIF_Adress = '0xA2a13cE1824F3916fC84C65e559391fc6674e6e8'
const UnicornsAdress = '0xdc0479cc5bba033b3e7de9f178607150b3abce1f'

const RBW_Adress = '0x431cd3c9ac9fc73644bf68bf5691f4b83f9e104f'
const UNIM_Adress = '0x64060ab139feaae7f06ca4e63189d86adeb51691'

let unif = new _web3.eth.Contract(erc721Abi, UNIF_Adress)
let unicorns = new _web3.eth.Contract(erc721Abi, UnicornsAdress)
let rbw = new _web3.eth.Contract(erc20Abi, RBW_Adress)
let unim = new _web3.eth.Contract(erc20Abi, UNIM_Adress)



const data = fs.readFile('src/token/unicorn/address.txt', 'utf8', (err, result) => {
  if (err) {
    console.error(err);
    return err;
  }
  var addresses = result.toString().split("\n")
  infoUnicornFromAdress(addresses)
});
//addresses just receive address
async function infoUnicornFromAdress(addresses) {
  var result = ''
  for (var i = 0; i < addresses.length; i++) {
     const uniBalance =  await unicorns.methods.balanceOf(addresses[i]).call()
     const unifBalance = await unif.methods.balanceOf(addresses[i]).call()
     var rbwBalance = await rbw.methods.balanceOf(addresses[i]).call()
     rbwBalance = convert18DecimalsToNomal(rbwBalance)
     var unimBalance = await unim.methods.balanceOf(addresses[i]).call()
     unimBalance = convert18DecimalsToNomal(unimBalance)
     result += addresses[i] + ',' + uniBalance +',' + unifBalance + ',' 
                         + rbwBalance + ',' + unimBalance + "\n"
     console.log(result)
      
  }
  fs.writeFile("src/token/unicorn/address-unicorns-info.txt", result, (err) => {
    if (err)
      console.log(err);
  });
}
