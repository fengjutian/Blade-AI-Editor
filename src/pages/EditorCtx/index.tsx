'use client';

import styles from './index.module.css';
import EditorCore from "@/app/editorCore";
import React, { useEffect, useState } from "react";
import { DocItem } from "@/app/PageType";
import { Operator } from "@/app/scheme";
import { List, Avatar, ButtonGroup, Button } from '@douyinfe/semi-ui';
import dynamic from 'next/dynamic';
import { logger, Logger, LogLevel } from '@/utils/logger'; // 修改导入，同时导入Logger类

// Dynamically import the calendar component with SSR disabled
const CalendarEle = dynamic(() => import('@/app/widgets/calendar'), {
  ssr: false,
  loading: () => <div>Loading calendar...</div>
});

export default function EditorCtx({ operator, docList, setOperator }: { operator: Operator, docList: DocItem[], setOperator: (operator: Operator) => void }) {
  const [curDoc, setCurDoc] = useState<DocItem>({ id: '', title: '', content: [] });
  const [doc, setDoc] = useState<DocItem[]>(docList);
  const [operatorState, setOperatorState] = useState<Operator>(operator);

  useEffect(() => {
    setOperatorState(operator);
  }, [operator])

  const getDocsList = () => {
    fetch('/api/docs', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => response.json())
    .then(data => {
      setDoc(data);
    })
    .catch(error => {
     console.error('Error creating file:', error);
    });
  };

  // 为编辑器组件创建专用的日志实例 - 修复这里
  const editorLogger = Logger.getInstance({ prefix: 'EDITOR_CTX', level: LogLevel.INFO });
  
  // 在组件中修改删除文档函数
  const deleteDoc = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    // 检查是否在客户端环境
    if (typeof window !== 'undefined') {
      if (confirm('确定要删除这个文档吗？')) {
        editorLogger.info(`用户尝试删除文档: ID=${id}`);
        try {
          const response = await fetch(`/api/docs/${id}`, {
            method: 'DELETE',
          });
          
          if (response.ok) {
            await getDocsList();
            editorLogger.info(`文档删除成功: ID=${id}`);
            // 可以添加成功提示
            if (typeof window !== 'undefined') {
              alert('文档删除成功');
            }
          } else {
            const errorData = await response.json();
            editorLogger.error(`文档删除失败: ID=${id}, 状态码=${response.status}, 错误=${errorData?.msg || '未知错误'}`);
            // 添加错误提示
            if (typeof window !== 'undefined') {
              alert(`删除失败: ${errorData?.msg || '未知错误'}`);
            }
          }
        } catch (error) {
          editorLogger.error(`文档删除请求异常: ID=${id}`, error as Error);
          // 添加异常提示
          if (typeof window !== 'undefined') {
            alert('网络请求异常，请稍后重试');
          }
        }
      }
    }
  };
  const selectedDoc = (e: any, item: DocItem) => {
    e.preventDefault();
    setOperatorState(Operator.EditDoc);
    setOperator(Operator.EditDoc);
    
    // 修复：确保内容被正确解析
    let parsedContent = item.content;
    try {
      // 如果content是字符串，尝试解析为JSON对象
      if (typeof parsedContent === 'string') {
        parsedContent = JSON.parse(parsedContent);
      }
      // 如果解析后是对象但不是数组，包装成数组
      if (!Array.isArray(parsedContent)) {
        parsedContent = [parsedContent];
      }
    } catch (error) {
      console.error('解析文档内容失败:', error);
      parsedContent = [{ type: 'p', children: [{ text: '解析内容失败' }] }];
    }
    
    // 使用解析后的内容创建新的文档对象
    const docWithParsedContent = {
      ...item,
      content: parsedContent
    };
    
    console.log('item.content', docWithParsedContent);
    setCurDoc(docWithParsedContent);
  }

  useEffect(() => {
    console.log('docList changed:', docList);
  }, [setOperator]);


  useEffect(() => {
    if (!docList || docList.length === 0) {
      getDocsList();
    }
  }, [])

  return (
    <div className={styles['editor-ctx-container']}>
      {/* 所有文档 */}
      {operatorState === Operator.AllDoc && (
        <div className={styles['docs-list-container']}>
          <h2 className={styles['page-title']}>所有文档</h2>
          <List
            bordered
            dataSource={doc}
            renderItem={item =>
            <List.Item
              key={item.id}
              header={<Avatar color="blue">Doc</Avatar>}
              main={
                <div>
                  {item.title}
                </div>
              }
              extra={
                <ButtonGroup theme="borderless">
                  <Button>编辑</Button>
                  <Button type="danger" onClick={(e) => deleteDoc(e, item.id)}>删除</Button>
                  <Button>更多</Button>
                </ButtonGroup>
              }
              onClick={(e) => selectedDoc(e, item)}>
            </List.Item>
          }
          />
        </div>
      )}

      {/* 日历 */}
      {operatorState === Operator.Calendar && (
        <div className={styles['calendar-container']}>
          <h2 className={styles['page-title']}>日历</h2>
          <CalendarEle />
        </div>
      )}

      {/* 编辑 */}
      {operatorState === Operator.EditDoc && (
        <div className={styles['editor-container']}>
          <div className={styles['editor-header']}>
            <h2 className={styles['page-title']}>{curDoc.title || '无标题文档'}</h2>
          </div>
          <div className={styles['editor-content']}>
            <EditorCore id={curDoc.id} title={curDoc.title} content={curDoc.content}/>
          </div>
        </div>
      )}
    </div>
  );
}
