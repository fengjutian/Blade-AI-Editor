'use client';
import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { Plate, usePlateEditor } from 'platejs/react';
import { EditorKit } from '@/components/editor-kit';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { createCollaborationManager, withYjs } from '@/components/editor/plugins/collaboration-kit';

// 导入yjs相关类型
import type { Doc as YDoc } from 'yjs';
import type { WebsocketProvider } from 'y-websocket';

export default function EditorCore({ id, content, title }: { id: string; content: any[]; title: string }) {
  // 确保初始值总是有效的Slate节点结构
  const getValidContent = (inputContent: any) => {
    if (!inputContent) {
      return [{ type: 'p', children: [{ text: '' }] }];
    }
    
    let parsedContent;
    if (typeof inputContent === 'string') {
      try {
        parsedContent = JSON.parse(inputContent);
      } catch {
        return [{ type: 'p', children: [{ text: inputContent }] }];
      }
    } else {
      parsedContent = inputContent;
    }
    
    if (!Array.isArray(parsedContent) || parsedContent.length === 0) {
      return [{ type: 'p', children: [{ text: '' }] }];
    }
    
    return parsedContent.map(node => {
      if (!node || typeof node !== 'object') {
        return { type: 'p', children: [{ text: String(node || '') }] };
      }
      
      // 确保每个节点都有children属性
      if (!node.children || !Array.isArray(node.children)) {
        return {
          ...node,
          type: node.type || 'p',
          children: [{ text: node.text || '' }]
        };
      }
      
      // 递归处理children
      const validChildren = node.children.map((child: any) => {
        if (!child || typeof child !== 'object') {
          return { text: String(child || '') };
        }
        if (child.text !== undefined) {
          return { text: String(child.text) };
        }
        return child;
      });
      
      return {
        ...node,
        type: node.type || 'p',
        children: validChildren
      };
    });
  };

  const initialValue = getValidContent(content);
  const [collaborationManager, setCollaborationManager] = useState<any>(null);
  const [yDoc, setYDoc] = useState<YDoc | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);

  // 初始化协同管理器 - Currently disabled for stability
  // useEffect(() => {
  //   if (!id) return;

  //   const manager = createCollaborationManager(id);
  //   setCollaborationManager(manager);
  //   setYDoc(manager.yDoc);
  //   setProvider(manager.provider);

  //   // 连接到协同服务器
  //   manager.connect();

  //   // 组件卸载时清理资源
  //   return () => {
  //     manager.disconnect();
  //     manager.yDoc.destroy();
  //   };
  // }, [id]);

  // 创建编辑器配置
  const editorConfig = useMemo(() => {
    // For now, keep it simple to ensure stability
    return {
      plugins: EditorKit,
      value: initialValue
    };
    
    // TODO: Re-enable Yjs collaboration once core functionality is stable
    // The server is now working at ws://localhost:1234
  }, [initialValue]);

  // 创建支持协同的编辑器
  const editor = usePlateEditor(editorConfig);

  // 简化内容初始化逻辑
  useEffect(() => {
    if (!editor) return;
    
    // 使用Slate API正确设置初始内容
    if (initialValue && initialValue.length > 0) {
      // 等待下一个事件循环再设置内容，确保编辑器已经初始化完成
      setTimeout(() => {
        try {
          editor.tf.reset();
          editor.tf.insertNodes(initialValue);
        } catch (error) {
          console.error('初始化内容失败:', error);
          // 如果设置失败，至少确保有一个空段落
          editor.tf.reset();
          editor.tf.insertNodes([{ type: 'p', children: [{ text: '' }] }]);
        }
      }, 0);
    }
  }, [editor, initialValue]);

  // 自动保存到服务器
  useEffect(() => {
    if (!editor || !id) return;

    // 监听内容变化并保存
    const handleContentChange = () => {
      if (editor.children && editor.children.length > 0 && 
          editor.children[0].children && editor.children[0].children[0].text) {
        fetch('/api/docs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: id,
            title: title,
            content: JSON.stringify(editor.children),
            action: 'update'
          }),
        });
      }
    };

    // 设置定时保存
    const saveInterval = setInterval(handleContentChange, 5000); // 每5秒自动保存

    return () => clearInterval(saveInterval);
  }, [editor, id, title]);

  return (
    <Plate editor={editor}>
      <EditorContainer variant="demo">
        <Editor />
      </EditorContainer>
    </Plate>
  );
}
