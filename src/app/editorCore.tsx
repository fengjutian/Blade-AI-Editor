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
  const initialValue: any[] = content ?? [];
  const [collaborationManager, setCollaborationManager] = useState<any>(null);
  const [yDoc, setYDoc] = useState<YDoc | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);

  // 初始化协同管理器
  useEffect(() => {
    if (!id) return;

    const manager = createCollaborationManager(id);
    setCollaborationManager(manager);
    setYDoc(manager.yDoc);
    setProvider(manager.provider);

    // 连接到协同服务器
    manager.connect();

    // 组件卸载时清理资源
    return () => {
      manager.disconnect();
      manager.yDoc.destroy();
    };
  }, [id]);

  // 创建编辑器配置，使用withYjs包装
  const editorConfig = useMemo(() => {
    if (!yDoc || !collaborationManager) {
      return {
        plugins: EditorKit,
        value: () => Array.isArray(initialValue) ? initialValue : []
      };
    }

    return {
      plugins: [...EditorKit],
      value: () => Array.isArray(initialValue) ? initialValue : [],
      // 使用withYjs包装编辑器配置
      editor: withYjs({
        yDoc,
        // 可以在这里添加其他Yjs相关配置
      })
    };
  }, [yDoc, collaborationManager, initialValue]);

  // 创建支持协同的编辑器
  const editor = usePlateEditor(editorConfig);

  // 初始化内容和自动保存逻辑保持不变
  useEffect(() => {
    // 初始化内容
    if (content && editor) {
      try {
        const parseContent = JSON.parse(content);
        if (parseContent.length > 0) {
          // 根据实际的编辑器API设置内容
          editor.children = parseContent;
        }
      } catch (error) {
        console.error('解析内容失败:', error);
      }
    }
  }, [content, editor]);

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
