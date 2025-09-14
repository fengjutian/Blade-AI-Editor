// 配置ts-node使用CommonJS模块模式
process.env.TS_NODE_COMPILER_OPTIONS = '{"module": "CommonJS"}';

// 注册ts-node（使用transpile-only模式提高性能）
require('ts-node/register/transpile-only');

// 加载Electron主进程文件
require('./electron-main');