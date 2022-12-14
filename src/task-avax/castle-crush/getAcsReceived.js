const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const  Web3 = require("web3");
const web3 = new Web3("https://api.avax.network/ext/bc/C/rpc");
const TOPIC = '0x288d9a5737d39d766acb848da277a970d9ee31f9115e17490b9393e282fa7b4d';
const REPORT_SCHOLAR_FILE = path.join(__dirname, './data/reportScholar.csv');
const REWARD_ADDRESS = "0x3D094Bb9Db4b8f3961bF06b0DA01F0471d26a055"

class ScholarAcsModel {
    constructor() {
        this.modelReportDate = {};
        this.modelReportScholar = {};
        this.lastBlock = 19915650;
        this.scholarWriter = fs.createWriteStream(REPORT_SCHOLAR_FILE, { flags: "a" });
        this.savedTx = {};
        this.startDate =  undefined
    }

    getTimeStampEndDate(){
        let date = new Date(this.lastDate);
        date.setDate(date.getDate() + 1)
        return date.getTime()
    }

    async getDate(blockNumber){
        const time = await web3.eth.getBlock(blockNumber);
        var date = new Date(time.timestamp * 1000);
        return date.toISOString().slice(0, 10)
    }

    async run(){
        this.lastDate = await this.getDate(this.lastBlock);
        if(!this.startDate){
            this.startDate = await this.getDate(this.lastBlock)
        }
        const currentBlock = await web3.eth.getBlockNumber();
        await this.saveDataPastLog(this.lastBlock, currentBlock)
        this.interval = setInterval(async () => {
            try {
                const currentBlock = await web3.eth.getBlockNumber();
                const saveData = await this.saveDataPastLog(this.lastBlock, currentBlock)
            } catch (err) { console.log(`Crawl ERROR`, err); }
        }, 30000)
    }
    async saveData(data){
        for(let i = 0; i < data.length ; i++){
            const address = web3.eth.abi.decodeParameters(['address'], data[i].topics[1])[0]
            if(address != REWARD_ADDRESS) continue
            if( data[i].logIndex + 2 == data[i + 1].logIndex && data[i].topics[3] == data[i + 1].topics[3]){
                if(this.savedTx[data[i + 1].transactionHash]) continue
                const scholar = web3.eth.abi.decodeParameters(['address'], data[i + 1].topics[1])[0]
                const amountReceived = web3.eth.abi.decodeParameters(['uint256'], data[i + 1].topics[3])[0] / (10 ** 18)
                const blockNumber = data[i + 1].blockNumber
                const time = await this.getDateTime(blockNumber)
                const dataResult = {
                    address : scholar,
                    amountReceived : parseFloat(amountReceived),
                    blockNumber : blockNumber,
                    time : time.toString(),
                    logIndex : data[i + 1].logIndex,
                    txid :data[i + 1].transactionHash
                }
                // report flow date
                if(time.getTime() >= this.getTimeStampEndDate()){
                    let date = new Date(this.getTimeStampEndDate())
                    this.lastDate = date.toISOString().slice(0, 10)
                }
                if(!this.modelReportDate[this.lastDate]){
                    this.modelReportDate[this.lastDate] = []
                }
                var foundIndex = this.modelReportDate[this.lastDate].findIndex(e => e.address.toLowerCase() == scholar.toLowerCase())
                if(foundIndex == -1){
                    this.modelReportDate[this.lastDate].push({
                        fromAddress : REWARD_ADDRESS,
                        address : scholar.toLowerCase(),
                        amount : parseFloat(amountReceived)
                    })
                }else{
                    this.modelReportDate[this.lastDate][foundIndex].amount += parseFloat(amountReceived)
                }
                 // report flow scholar
                if(!this.modelReportScholar[scholar.toLowerCase()]){
                    this.modelReportScholar[scholar.toLowerCase()] = []
                }
                this.savedTx[data[i].transactionHash] = true
                this.modelReportScholar[scholar.toLowerCase()].push( dataResult )
                this.scholarWriter.write(`${scholar},${amountReceived},${blockNumber},${time},${data[i + 1].logIndex},${data[i + 1].transactionHash}\n`);
            }
        }
    }

    async revertData(){
        this.startDate = await this.getDate(this.lastBlock)
        const reader = fs.createReadStream(REPORT_SCHOLAR_FILE).pipe(csv())
            .on('data', (item) => {
                if(!this.modelReportScholar[item.address.toLowerCase()]){
                    this.modelReportScholar[item.address.toLowerCase()] = []
                }
                this.modelReportScholar[item.address.toLowerCase()].push({
                    address : item.address,
                    amountReceived : parseFloat(item.amountReceived),
                    blockNumber : item.blockNumber,
                    time : item.time,
                    logIndex : item.logIndex,
                    txid : item.txid
                })
                this.updateLastDate(item.time)

                if(!this.modelReportDate[this.lastDate]){
                    this.modelReportDate[this.lastDate] = []
                }

                var foundIndex = this.modelReportDate[this.lastDate].findIndex(e => e.address.toLowerCase() == item.address.toLowerCase())
                if(foundIndex == -1){
                    this.modelReportDate[this.lastDate].push({
                        fromAddress : item.fromAddress ? item.fromAddress : REWARD_ADDRESS,
                        address : item.address.toLowerCase(),
                        amount : parseFloat(item.amountReceived)
                    })
                }else{
                    this.modelReportDate[this.lastDate][foundIndex].amount += parseFloat(item.amountReceived) 
                }
                this.lastBlock = parseInt(item.blockNumber)
                this.savedTx[item.txid] = true
            });
        return new Promise((res, rej) =>
            reader.on('end', () => res()).on('error', err => rej(err))
        )
    }
    
    updateLastDate(time){
        let date = new Date(time)
        date = date.toISOString().slice(0, 10)
        if(this.lastDate){
            this.lastDate = date
        }else if(date != this.lastDate){
            this.lastDate = date
        }
    }

    loadAcsReceived(fromDate, toDate){
        let from = new Date(fromDate);
        let to = new Date(toDate);
        if(to.getTime() < from.getTime()){
            let error = {
                error : "The end date must not be greater than the start date"
            }
            return error
        }
        let result = []
        while(from.getTime() <= to.getTime()){
            const data = this.modelReportDate[from.toISOString().slice(0, 10)]
            if(!data){
                from.setDate(from.getDate() + 1)
                continue
            } 
            for(let item of data){
                var foundIndex = result.findIndex(e => e.address.toLowerCase() == item.address.toLowerCase())
                if(foundIndex == -1){
                    result.push({
                        fromAddress : item.fromAddress ? item.fromAddress : REWARD_ADDRESS,
                        address : item.address,
                        amount : item.amount
                    })
                }else{
                    result[foundIndex].amount += parseFloat(item.amount)
                }
            }
            from.setDate(from.getDate() + 1)
        }
        return result
    }

    loadHistoryUserReceivedAcs(scholar){
        return this.modelReportScholar[scholar.toLowerCase()]
    } 
    async saveDataPastLog(fromBlock, toBlock) {
        if(toBlock - fromBlock <= 2000){
            const pastLogs = await web3.eth.getPastLogs({
                fromBlock : fromBlock,
                toBlock : toBlock,
                topics: [TOPIC],
            })
            await this.saveData(pastLogs)
        }else{
            let start = fromBlock
            let end = start + 2000
            while(toBlock - start > 2000){
                const pastLogs = await web3.eth.getPastLogs({
                    fromBlock : start,
                    toBlock : end,
                    topics: [TOPIC],
                })
                start = end
                end = start + 2000
                await this.saveData(pastLogs)
            }
            const pastLogs = await web3.eth.getPastLogs({
                fromBlock : start,
                toBlock : toBlock,
                topics: [TOPIC],
            })
            await this.saveData(pastLogs)
        }
        this.lastBlock = toBlock
    }
    async getDateTime(block) {
        let time = await web3.eth.getBlock(block);
        time = time.timestamp
        const date = new Date(time * 1000);
        return date;
    }
}
module.exports = ScholarAcsModel;