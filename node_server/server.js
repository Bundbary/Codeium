// Import necessary modules
const express = require('express');
const http = require('http');
const https = require('https');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

// Create an Express application
const app = express();

// Serve static files from the "public" directory
app.use(express.static('public'));

// Variables to determine if SSL is enabled
const useSSL = process.env.HOME === '/home/chameleon';
let server;

if (useSSL) {
  // SSL options
  const privateKey = fs.readFileSync('/home/chameleon/ssl/keys/ba499_0f8eb_ced19026803c0f17e1d5303a13bc8efb.key', 'utf8');
  const certificate = fs.readFileSync('/home/chameleon/ssl/certs/chameleon_sdiclarity_com_ba499_0f8eb_1723420799_bd79a33f5774aea95a6bdba33f5c4f9c.crt', 'utf8');
  const ca = fs.readFileSync('/home/chameleon/ssl/certs/chameleon_sdiclarity_com_ba499_0f8eb_1723420799_bd79a33f5774aea95a6bdba33f5c4f9c.crt.cache', 'utf8');

  const credentials = {
    key: privateKey,
    cert: certificate,
     ca: ca
  };

  // Create an HTTPS server
  server = https.createServer(credentials, app);
  console.log('Using HTTPS for secure connection');
} else {
  // Create an HTTP server
  server = http.createServer(app);
  console.log('Using HTTP for connection');
}

// Create a WebSocket server and attach it to the HTTP/HTTPS server
const wss = new WebSocket.Server({ server });

const clients = {};

const generateUniqueId = () => {
  return 'client_' + Math.random().toString(36).substr(2, 9);
};

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

  ws.on('message', message => {
    console.log(`Received message: ${message}`);

    if (message.username) {
      ws.send('pong');
      return;
    }

    // Parse the incoming message as JSON
    const data = JSON.parse(message);
    const fileSave = data.fileSave;
    if (fileSave) {
      const fileName = fileSave.fileName;
      const fileContent = message + "\n\n";

      // Ensure the directory exists
      const dir = path.dirname(fileName);
      fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) {
          console.error(`Failed to create directory: ${err}`);
          return;
        }

        // Check if the file already exists
        fs.access(fileName, fs.constants.F_OK, (err) => {
          if (err || fileSave.flag !== "append") {
            // File does not exist or flag is not "append", so create it and write the content
            fs.writeFile(fileName, fileContent, (err) => {
              if (err) {
                console.error(`Failed to write file: ${err}`);
              } else {
                console.log(`File saved successfully: ${fileName}`);
              }
            });
          } else {
            // File exists and flag is "append", so append the content to the existing file
            fs.appendFile(fileName, fileContent, (err) => {
              if (err) {
                console.error(`Failed to append to file: ${err}`);
              } else {
                console.log(`Content appended to file successfully: ${fileName}`);
              }
            });
          }
        });
      });
    } else if (data.getGames) {
      fs.readdir(path.join(__dirname, 'chess_games'), (err, files) => {
        if (err) {
          console.error(`Failed to read directory: ${err}`);
          return;
        }
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        data.games = jsonFiles;

        broadcast(data);
      });
      return;
    }
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
