const testws = websocket =>{
    websocket.on('connection', function connection(ws) {
      console.log('A new client Connected!');
      ws.send('Welcome New Client!');
    
      ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        websocket.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
      });
    });
}
module.exports = {
  testws
}

