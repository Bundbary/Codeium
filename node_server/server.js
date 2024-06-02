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
      // console.log(data);
      client.send(JSON.stringify(data));
    }
  });
}

// Set up WebSocket connection event
wss.on('connection', ws => {
  console.log('New client connected');

  // Set up message event
  // ws.on('message', message => {
  //   console.log(`Received message: ${message}`);
  //   // Parse the incoming message as JSON
  //   const data = JSON.parse(message);
  //   const fileSave = data.fileSave;
  //   console.log("111");
  //   if (fileSave && fileSave.fileName) {
  //     console.log("222");
  //     // Write the data to a JSON file
  //     const path = require('path');
  //     const dirname = path.dirname(fileSave.fileName);
  //     if (dirname.includes('/')) {
  //       console.log("333");
  //       // Create all directories in the path if they don't exist
  //       const fs = require('fs');
  //       const mkdir = require('make-dir');
  //       const dirs = dirname.split('/');
  //       let dir = '';
  //       for (let i = 0; i < dirs.length; i++) {
  //     console.log("222");
  //         dir += (dir === '' ? dirs[i] : '/' + dirs[i]);
  //         mkdir.sync(dir);
  //       }
  //     }


  //     const fs = require('fs');
  //     fs.access(fileSave.fileName, fs.constants.F_OK, (err) => {
  //       if (err || fileSave.flag !== "append") {
  //         // File does not exist, create it and write the data
  //         fs.writeFile(fileSave.fileName, JSON.stringify(data), (err) => {
  //           if (err) {
  //             console.error(err);
  //           }
  //         });
  //       } else {
  //         // File exists, append to the existing file
  //         fs.appendFile(fileSave.fileName, JSON.stringify(data), (err) => {
  //           if (err) {
  //             console.error(err);
  //           }
  //         });
  //       }
  //     });
  //   }

  //   // Broadcast the received message to all connected clients
  //   broadcast(data);
  // });
  ws.on('message', message => {
    // console.log(`Received message: ${message}`);

    // Parse the incoming message as JSON
    const data = JSON.parse(message);
    const fileSave = data.fileSave;

    if (fileSave) {

      const fileName = fileSave.fileName;
      const fileContent = message + "\n\n";

      // Ensure the directory exists
      const path = require('path');
      const dir = path.dirname(fileName);
      const fs = require('fs');
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
