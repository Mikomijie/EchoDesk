const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files (our HTML pages) from this folder
app.use(express.static(__dirname));
app.use(express.json());

let connectedStudents = [];

wss.on('connection', (ws) => {
  console.log('A student connected');
  connectedStudents.push(ws);

  ws.on('close', () => {
    connectedStudents = connectedStudents.filter(client => client !== ws);
    console.log('A student disconnected');
  });
});

function broadcastText(text) {
  connectedStudents.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(text);
    }
  });
}

// Endpoint the lecturer's page calls every time new text is transcribed
app.post('/broadcast', (req, res) => {
  const text = req.body.text;
  broadcastText(text);
  res.sendStatus(200);
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`EchoDesk server running at http://localhost:${PORT}`);
});