const getDataEvent = async (contract, eventName, options) => {
    const data = await contract.getPastEvents(eventName, options)
    .then(result => {
        return result
    })
    .catch(err => console.log('error', err.message, err.stack));
    return data
  
}

module.exports = {
    getDataEvent
}