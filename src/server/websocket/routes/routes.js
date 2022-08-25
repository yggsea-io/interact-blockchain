const { testws } = require("./example")

const routerWS = websocket => {
    testws(websocket)
}

module.exports = routerWS