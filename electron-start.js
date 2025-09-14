// 配置ts-node使用CommonJS模块模式
process.env.TS_NODE_COMPILER_OPTIONS = '{"module": "CommonJS", "moduleResolution": "node"}';

// 配置ts-node忽略tsconfig.json中的模块解析设置
process.env.TS_NODE_PROJECT = 'tsconfig.electron.json';

// 设置开发环境变量
process.env.NODE_ENV = 'development';

console.log('开始启动Electron...');
console.log('当前工作目录:', process.cwd());
console.log('Node.js版本:', process.version);
console.log('Electron主进程文件路径:', require.resolve('./electron-main.ts'));

// 注册ts-node并加载Electron主进程文件
try {
  console.log('注册ts-node...');
  require('ts-node/register/transpile-only');
  console.log('加载electron-main.ts...');
  require('./electron-main');
  console.log('electron-main.ts加载成功');
} catch (error) {
  console.error('启动Electron失败:', error);
  console.error('错误堆栈:', error.stack);
  // 保持进程运行以便查看错误
  setInterval(() => {}, 1000);
}