const http = require('http');
const { createServer } = require('y-websocket');
const { setPersistence } = require('yjs');
const { LeveldbPersistence } = require('y-leveldb');

// 设置持久化存储
const persistence = new LeveldbPersistence('./yjs-data');
setPersistence(persistence);

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Y.js WebSocket Server is running\n');
});

// 将WebSocket服务器附加到HTTP服务器
const wsServer = createServer({
  perMessageDeflate: false // 禁用压缩以提高性能
}, server);

// 启动服务器
const PORT = 1234;
server.listen(PORT, () => {
  console.log(`Y.js WebSocket Server running on port ${PORT}`);
});