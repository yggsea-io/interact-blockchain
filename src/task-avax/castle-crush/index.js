const express = require('express');
const ScholarAcsModel = require("./getAcsReceived");
const scholarAcsModel = new ScholarAcsModel();

const app = express();
app.use(express.json());

app.get('/castle-crush/acs-received', async (req, res) => {
    let date = req.query.date
    if(!date){
        return res.json({ message: "params is valid" })
    }
    let result = scholarAcsModel.loadAcsReceivedDate(date)
    if(!result) result = []
    return res.json(result);
});
app.get('/castle-crush/history', async (req, res) => {
    let scholarAdrr = req.query.scholar
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
start(17000);