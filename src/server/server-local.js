const express = require('express');
const bodyParser = require("body-parser");
const routerSqlite = require("./sqlite/routes/routes")
const routerWS = require("./websocket/routes/routes")
const port = 3002;
const app = express(); 
const WebSocket = require('ws');

// Use Node.js body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);
 
    console.log(`Server listening on port ${server.address().port}`);
});

const websocket = new WebSocket.Server({ server : server });

routerSqlite(app);
routerWS(websocket);



module.exports = {
    app,
    websocket
}