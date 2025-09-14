'use client';
import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { Plate, usePlateEditor } from 'platejs/react';
import { EditorKit } from '@/components/editor-kit';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { DocItem } from '@/app/PageType';

// 专门处理Slate文档结构的函数，确保正确提取text属性
const getValidContent = (inputContent: any) => {
  console.log('处理前的内容类型:', typeof inputContent, Array.isArray(inputContent));
  console.log('原始内容:', inputContent);
  
  // 空值处理
  if (!inputContent || (Array.isArray(inputContent) && inputContent.length === 0)) {
    return [{ type: 'p', children: [{ text: '' }] }];
  }
  
  // 特殊情况处理：如果内容是字符串，尝试解析
  if (typeof inputContent === 'string') {
    try {
      // 尝试解析为JSON
      const parsed = JSON.parse(inputContent);
      // 递归处理解析后的内容
      return getValidContent(parsed);
    } catch {
      // 解析失败，作为普通文本处理
      return [{ type: 'p', children: [{ text: inputContent }] }];
    }
  }
  
  // 规范化为数组
  const contentArray = Array.isArray(inputContent) ? inputContent : [inputContent];
  
  // 处理每个节点
  return contentArray.map((item: any) => {
    // 基本类型或null处理
    if (item === null || typeof item !== 'object') {
      return { 
        type: 'p', 
        children: [{ text: String(item || '') }] 
      };
    }
    
    // 检查是否已经是有效的Slate文档结构
    if (item.children && Array.isArray(item.children)) {
      return {
        type: item.type || 'p',
        children: processChildren(item.children)
      };
    }
    
    // 如果是对象但没有children，尝试从中提取文本
    return {
      type: 'p',
      children: [{ text: extractTextFromObject(item) }]
    };
  });
};

// 处理子节点数组
const processChildren = (children: any[]): { text: string }[] => {
  return children.map((child: any) => {
    // 文本字符串直接包装
    if (typeof child === 'string') {
      return { text: child };
    }
    // 有text属性的对象
    if (typeof child === 'object' && child !== null && 'text' in child) {
      return { text: String(child.text || '') };
    }
    // 其他对象尝试提取文本
    if (typeof child === 'object' && child !== null) {
      return { text: extractTextFromObject(child) };
    }
    // 默认处理
    return { text: String(child || '') };
  });
};

// 从对象中提取文本内容的辅助函数
const extractTextFromObject = (obj: any): string => {
  // 检查常见的文本属性
  if (obj.text) return String(obj.text);
  if (obj.content && typeof obj.content === 'string') return obj.content;
  if (obj.value && typeof obj.value === 'string') return obj.value;
  
  // 如果是数组，递归处理
  if (Array.isArray(obj.content)) {
    return obj.content.map((item: any) => extractTextFromObject(item)).join(' ');
  }
  
  // 遍历所有属性寻找可能的文本
  let text = '';
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      text += obj[key] + ' ';
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      text += extractTextFromObject(obj[key]) + ' ';
    }
  }
  
  // 如果没有找到文本，返回对象的字符串表示
  return text.trim() || String(obj);
};

export default function EditorCore({ id, content, title }: { id: string; content: DocItem['content']; title: string }) {
  // 获取有效的初始内容
  const initialValue = useMemo(() => getValidContent(content), [content]);
  
  console.log('处理后的内容:', initialValue);
  
  // 创建编辑器实例
  const editor = usePlateEditor({
    plugins: EditorKit,
    value: initialValue
  });
  
  // 自动保存功能
  useEffect(() => {
    if (!editor || !id) return;

    const handleContentChange = async () => {
      try {
        const response = await fetch('/api/docs', {
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
        
        if (!response.ok) {
          console.error('保存文档失败:', await response.json());
        }
      } catch (error) {
        console.error('保存请求异常:', error);
      }
    };

    const saveInterval = setInterval(handleContentChange, 5000);
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

