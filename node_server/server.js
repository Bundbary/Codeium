// Import necessary modules
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Create an Express application
const app = express();

// Serve static files from the "public" directory
app.use(express.static('public'));

// Create an HTTP server
const server = http.createServer(app);

// Create a WebSocket server and attach it to the HTTP server
const wss = new WebSocket.Server({ server });

// Function to broadcast a message to all connected clients
function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Set up WebSocket connection event
wss.on('connection', ws => {
  console.log('New client connected');

  // Set up message event
  ws.on('message', message => {
    console.log(`Received message: ${message}`);

    // Parse the incoming message as JSON
    const data = JSON.parse(message);

    // Broadcast the received message to all connected clients
    broadcast(data);
  });

  // Set up close event
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
