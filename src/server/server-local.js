const express = require('express');
const bodyParser = require("body-parser");
const routerSqlite = require("./sqlite/routes/routes")
const routerWS = require("./websocket/routes/routes")
const routerMongo = require("./mongoose/routes/turorial.routes")

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require('./doc/swagger.json')

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
const db = require("./mongoose/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

//init routes for interact database
routerSqlite(app);
routerWS(websocket);
routerMongo(app)

//swagger doc
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


module.exports = { app, websocket }

