import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
// 使用正确的API导入
import { withYjs } from '@platejs/yjs';
import { v4 as uuidv4 } from 'uuid';

// 生成唯一用户ID
const userId = uuidv4();
const userName = `User_${Math.floor(Math.random() * 1000)}`;

// 移除不存在的createCollaborationPlugin调用
// 协同插件将通过withYjs在编辑器初始化时应用

// 修改协同管理器创建函数
// 返回的是实际需要的对象，不再包含不存在的collaborationPlugin

export const createCollaborationManager = (documentId: string) => {
  // 创建Yjs文档
  const yDoc = new Y.Doc();
  
  // 配置WebSocket连接
  const provider = new WebsocketProvider(
    'ws://localhost:1234', // 协同服务器地址
    documentId,
    yDoc,
    {
      connect: false, // 手动控制连接
    }
  );
  
  // 设置用户信息
  provider.awareness.setLocalStateField('user', {
    id: userId,
    name: userName,
    color: `hsl(${(Math.random() * 360).toFixed(0)}, 70%, 70%)`,
  });
  
  return {
    yDoc,
    provider,
    userId,
    userName,
    connect: () => provider.connect(),
    disconnect: () => provider.disconnect(),
  };
};

// 导出withYjs函数供其他地方使用
export { withYjs };