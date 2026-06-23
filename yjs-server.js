const http = require('http');
const WebSocket = require('ws');
const Y = require('yjs');

const docs = new Map();

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Y.js WebSocket Server is running\n');
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  const docName = req.url.slice(1);
  console.log(`Client connected to document: ${docName}`);

  ws.docName = docName;

  let doc = docs.get(docName);
  if (!doc) {
    doc = new Y.Doc();
    docs.set(docName, doc);
    console.log(`Created new document: ${docName}`);
  }

  // Send initial sync state to the client
  const encoder = Y.encodeStateAsUpdate(doc);
  if (encoder.length > 2) {
    ws.send(encoder, { binary: true });
  }

  const updateHandler = (update, origin) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN && client.docName === docName) {
        client.send(update, { binary: true });
      }
    });
  };

  doc.on('update', updateHandler);

  ws.on('message', (message) => {
    try {
      Y.applyUpdate(doc, new Uint8Array(message));
    } catch (e) {
      console.error('Failed to apply Y.js update:', e);
    }
  });

  ws.on('close', () => {
    doc.off('update', updateHandler);
    console.log(`Client disconnected from document: ${docName}`);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

const PORT = 1234;
server.listen(PORT, () => {
  console.log(`Y.js WebSocket Server running on port ${PORT}`);
});
