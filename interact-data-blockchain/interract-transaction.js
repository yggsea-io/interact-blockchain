const getContractTransactions = async (contract, options, eventName) => {
    const transactions = await contract.getPastEvents(eventName, options)
    .then(result => {
        console.log("result", result)
      return result
    })
    .catch(err => console.log('error', err.message, err.stack));
    return transactions
  
}
module.exports = {
    getContractTransactions
}