const http = require('http');
const WebSocket = require('ws');
const Y = require('yjs');

// Store documents in memory (you can add persistence later)
const docs = new Map();

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Y.js WebSocket Server is running\n');
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection established');
  
  // Extract document name from URL
  const docName = req.url.slice(1); // Remove leading slash
  console.log(`Client connected to document: ${docName}`);
  
  // Get or create document
  let doc = docs.get(docName);
  if (!doc) {
    doc = new Y.Doc();
    docs.set(docName, doc);
    console.log(`Created new document: ${docName}`);
  }
  
  // Handle WebSocket messages
  ws.on('message', (message) => {
    console.log('Received message from client');
    // Broadcast to all other clients connected to this document
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Start server
const PORT = 1234;
server.listen(PORT, () => {
  console.log(`Y.js WebSocket Server running on port ${PORT}`);
});