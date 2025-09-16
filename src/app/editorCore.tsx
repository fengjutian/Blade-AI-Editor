'use client';
import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { Plate, usePlateEditor } from 'platejs/react';
import { EditorKit } from '@/components/editor-kit';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { DocItem } from '@/app/PageType';

// 专门处理Slate文档结构的函数，确保正确提取text属性
const getValidContent = (inputContent: any): any[] => {
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
  
  // 处理每个节点，增强验证
  return contentArray.map((item: any) => {
    // 基本类型或null处理
    if (item === null || typeof item !== 'object') {
      return { 
        type: 'p', 
        children: [{ text: String(item || '') }] 
      };
    }
    
    // 检查是否已经是有效的Slate文档结构
    if (item.type && item.children && Array.isArray(item.children)) {
      // 验证和清理children
      const validChildren = item.children.map((child: any) => {
        // 确保 text 节点的安全性
        if (typeof child === 'object' && child !== null && 'text' in child) {
          return { text: String(child.text || '') };
        }
        // 如果是字符串，转换为text节点
        if (typeof child === 'string') {
          return { text: child };
        }
        // 其他情况转换为空文本
        return { text: String(child || '') };
      });
      
      // 确保至少有一个children
      if (validChildren.length === 0) {
        validChildren.push({ text: '' });
      }
      
      return {
        type: item.type,
        children: validChildren,
        // 保留原始属性，但过滤掉不安全的属性
        ...Object.fromEntries(
          Object.entries(item).filter(([key, value]) => {
            // 只保留安全的属性
            return key !== 'type' && key !== 'children' && 
                   typeof value !== 'function' && 
                   (typeof value !== 'object' || 
                    (typeof value === 'object' && value !== null && !Array.isArray(value)));
          })
        )
      };
    }
    
    // 如果是对象但没有children，尝试从中提取文本
    return {
      type: 'p',
      children: [{ text: extractTextFromObject(item) }]
    };
  }).filter(Boolean); // 过滤掉可能的空值
};

// 从对象中提取文本内容的辅助函数
const extractTextFromObject = (obj: any): string => {
  // 检查常见的文本属性
  if (obj.text) return String(obj.text);
  if (obj.content && typeof obj.content === 'string') return obj.content;
  if (obj.value && typeof obj.value === 'string') return obj.value;
  
  // 特殊处理children数组中的text
  if (obj.children && Array.isArray(obj.children)) {
    const textFromChildren = obj.children
      .map((child: any) => {
        if (child.text) return child.text;
        if (typeof child === 'string') return child;
        return extractTextFromObject(child);
      })
      .join(' ');
    
    return textFromChildren || JSON.stringify(obj);
  }
  
  // 如果是数组，递归处理
  if (Array.isArray(obj)) {
    return obj.map((item: any) => extractTextFromObject(item)).join(' ');
  }
  
  // 默认返回对象的字符串表示
  return String(obj);
};

export default function EditorCore({ id, content, title }: { id: string; content: DocItem['content']; title: string }) {
  // 获取有效的初始内容
  const initialValue = useMemo(() => {
    const processed = getValidContent(content);
    console.log('处理后的内容:', processed);
    return processed;
  }, [content]);
  
  // 创建编辑器实例，先不集成协同功能避免错误
  const editor = usePlateEditor({
    plugins: EditorKit,
    value: initialValue
  });
  
  // 确保内容更新 - 使用正确的 Slate API
  useEffect(() => {
    if (editor && initialValue) {
      try {
        // 使用 Slate 的正确 API 来更新内容
        setTimeout(() => {
          editor.tf.reset();
          editor.tf.insertNodes(initialValue);
        }, 0);
      } catch (error) {
        console.error('更新编辑器内容失败:', error);
        // 使用安全的回退方案
        setTimeout(() => {
          try {
            editor.tf.reset();
            editor.tf.insertNodes([{ type: 'p', children: [{ text: '内容加载失败，请刷新页面重试' }] }]);
          } catch (fallbackError) {
            console.error('回退更新也失败:', fallbackError);
          }
        }, 100);
      }
    }
  }, [editor, initialValue]);
  
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

  // 修改组件返回部分
  return (
    <Plate editor={editor}>
      <EditorContainer className="h-full w-full">
        <Editor className="h-full w-full" />
      </EditorContainer>
    </Plate>

  );
}



