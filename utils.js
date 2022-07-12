
let Web3 = require("web3")
require('dotenv').config();
const eviroment = process.env.EVIROMENT_MUMBAI;
console.log("eviroment", eviroment)
const web3 = () => {
  // var _web3;
  // if (typeof _web3 !== 'undefined') {
  //   _web3 = new Web3(web3.currentProvider);
  // } else {
  //   _web3 = new Web3(new Web3.providers.HttpProvider(eviroment));
  // }
  const _web3 = new Web3(new Web3.providers.HttpProvider(eviroment));
  return _web3
}

const contract_transaction = (contract, options, event_name) =>{
  contract.getPastEvents(event_name, options)
  .then(result => {
    console.log('result', result)
    return result
  })
  .catch(err => console.log('error', err.message, err.stack));

}


module.exports = {
  web3,
  contract_transaction
}
