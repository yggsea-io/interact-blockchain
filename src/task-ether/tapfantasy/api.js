const WebSocket = require('ws')
var websocket = new WebSocket('wss://gs2.tapfantasy.io:7205/')

//send to server
websocket.on('open', function open() {
    websocket.send("08 c9 01 10 23 1a 2c 0a 2a 30 78 33 38 36 36 64 64 36 65 63 33 38 39 62 62 37 63 37 31 35 31 62 61 35 62 36 64 35 62 62 66 61 64 38 38 32 35 31 35 61 37")
});

//receive from server
websocket.on('message', function incomming(data) {
    console.log('received: %s', data);
    websocket.close()
});

