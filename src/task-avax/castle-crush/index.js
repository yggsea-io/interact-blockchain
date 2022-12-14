const express = require('express');
const ScholarAcsModel = require("./getAcsReceived");
const scholarAcsModel = new ScholarAcsModel();

const app = express();
app.use(express.json());

app.get('/castle-crush/acs-received', async (req, res) => {

    let fromDate = req.query.fromDate
    let toDate = req.query.toDate
    let result
    if(fromDate && toDate){
        result = scholarAcsModel.loadAcsReceived(fromDate, toDate)
    }else{
        let currentDate = new Date()
        result = scholarAcsModel.loadAcsReceived(scholarAcsModel.startDate, currentDate.toISOString().slice(0, 10))
    }
    if(!result) result = []
    return res.json(result);
});

app.get('/castle-crush/history', async (req, res) => {
    let scholarAdrr = req.query.scholar
    if(!scholarAdrr){
        return res.json({ error: "params is valid" })
    }
    let result = scholarAcsModel.loadHistoryUserReceivedAcs(scholarAdrr)
    if(!result) result = []
    return res.json(result);
});


async function start(port) {
    const startMs = Date.now();
    app.listen(port);
    const ms = Date.now() - startMs;
    console.log(`Service start at port ${port} (${ms}ms)`)
    await scholarAcsModel.revertData()
    await scholarAcsModel.run();
}
start(17000);