'use client';

import './index.module.css';
import EditorCore from "@/app/editorCore";
import React, { useEffect, useState } from "react";
import { DocItem } from "@/app/PageType";
import { Operator } from "@/app/scheme";
import { List, Avatar, ButtonGroup, Button } from '@douyinfe/semi-ui';
import CalendarEle from "@/app/widgets/calendar";

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

  // 添加删除文档函数
  const deleteDoc = (e: any, id: string) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发文档选择
    
    if (window.confirm('确定要删除这个文档吗？此操作无法撤销。')) {
      fetch(`/api/docs/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        if (response.ok) {
          // 删除成功后更新文档列表
          getDocsList();
        } else {
          throw new Error('删除文档失败');
        }
      })
      .catch(error => {
        console.error('Error deleting file:', error);
        alert('删除文档失败，请重试');
      });
    }
  };

  const selectedDoc = (e: any, item: DocItem) => {
    e.preventDefault();
    setOperatorState(Operator.EditDoc);
    setOperator(Operator.EditDoc);
    console.log('item.content', item);
    setCurDoc(item);
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
    <div className="title">

      {/* 所有文档 */}
      {
        operatorState === Operator.AllDoc && (
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
                  <Button danger onClick={(e) => deleteDoc(e, item.id)}>删除</Button>
                  <Button>更多</Button>
                </ButtonGroup>
              }
              onClick={(e) => selectedDoc(e, item)}>
            </List.Item>
          }
          />
        )
      }

      {/* 日历 */}
      {
        operatorState === Operator.Calendar && (
          <CalendarEle />
        )
      }

      {/* 编辑 */}
      {
        operatorState === Operator.EditDoc && (
          <EditorCore id={curDoc.id} title={curDoc.title} content={curDoc.content}/>
        )
      }
    </div>
  );
}
