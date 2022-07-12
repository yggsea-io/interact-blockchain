const { web3 } = require("./utils")
const { contract_transaction } = require("./utils")

const tick_token = require("./tic_token.json")
const abi = tick_token.abi
const address = tick_token.address;
const block_number_deploy = tick_token.receipt.logs[0].blockNumber;
const block_filter_current = block_number_deploy;

async function get_transaction(_from, _to, _value) {
    const _web3 = web3()
    if (_web3) {
        const _fromBlock = block_filter_current
        const _toBlock = await update_block_filter()
        let contract = new _web3.eth.Contract(abi, address)
        let options = {
            filter: {
                from: _from,
                to: _to,
                value: _value,
            },
            fromBlock: _fromBlock,
            toBlock: _toBlock
        };
        console.log("data", _from, _to, _fromBlock, _toBlock)

        return contract_transaction(contract, options, "Transfer")
    }

}
async function update_block_filter (){
    const _web3 = web3()
    const current_block = await _web3.eth.getBlockNumber()
    if(block_filter_current >= current_block){
        return block_filter_current
    }
    if(block_filter_current + 1000 > current_block){
        return current_block
    }
    else return block_filter_current + 1000
}

get_transaction("0xC7446945830E99389AD2fd29707034f998bF65d8", 
        "0x4b023d85601B6101CC6EE073E85A689D521e0B78", [])
