const express = require('express');
const ScholarAcsModel = require("./getAcsReceived");
const scholarAcsModel = new ScholarAcsModel();

const app = express();
app.use(express.json());

app.get('/getAcsReceived', async (req, res) => {
    let scholarAdrr = req.query.scholarAdrress
    let date = req.query.date
    if(!scholarAdrr || !date){
        return res.json({ message: "params is valid" })
    }
    let amount = scholarAcsModel.loadAcsReceivedDate(scholarAdrr, date)
    if(!amount) amount = 0
    return res.json({ amount : amount});
});
app.get('/history', async (req, res) => {
    let scholarAdrr = req.query.scholarAdrress
    if(!scholarAdrr){
        return res.json({ message: "params is valid" })
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
start(1500);