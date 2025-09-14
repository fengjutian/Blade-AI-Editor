// 配置ts-node使用CommonJS模块模式
process.env.TS_NODE_COMPILER_OPTIONS = '{"module": "CommonJS"}';

// 配置ts-node忽略tsconfig.json中的模块解析设置
process.env.TS_NODE_PROJECT = 'tsconfig.electron.json';

// 注册ts-node并加载Electron主进程文件
try {
  require('ts-node/register/transpile-only');
  require('./electron-main');
} catch (error) {
  console.error('启动Electron失败:', error);
  // 保持窗口打开以便查看错误
  setTimeout(() => {}, 10000);
}