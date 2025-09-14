import { app, BrowserWindow, Menu } from 'electron';
import * as path from 'path';
import * as url from 'url';

// 在开发模式下，你可以让 Electron 加载本地服务器地址；
// 在生产模式下，加载打包好的本地文件。
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false, // 建议关闭 nodeIntegration，提升安全
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },

    // 移除 devTools 选项，在开发模式下通过 mainWindow.webContents.openDevTools() 打开开发者工具
  });

  // 设置应用菜单
  Menu.setApplicationMenu(null); // 可选：隐藏默认菜单

  if (isDev) {
    // 开发模式：加载 localhost
    mainWindow.loadURL('http://localhost:3000');
    // 打开开发者工具
    mainWindow.webContents.openDevTools();
  } else {
    // 生产模式：加载打包后的本地文件
    const startUrl = url.format({
      pathname: path.join(__dirname, 'out', 'index.html'),
      protocol: 'file:',
      slashes: true
    });
    mainWindow.loadURL(startUrl);
  }

  // 窗口事件监听
  mainWindow.on('closed', () => {
    // 清理
  });
}

// 确保只有一个实例运行
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时，聚焦到主窗口
    const windows = BrowserWindow.getAllWindows();
    if (windows.length) {
      const mainWindow = windows[0];
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
      // macOS 上，当 dock 图标被点击且没有其他窗口打开时:
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
}

// 所有窗口关闭时退出应用 (在 macOS 除外)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
