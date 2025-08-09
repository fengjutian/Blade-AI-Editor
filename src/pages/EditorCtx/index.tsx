'use client';

import './index.module.css';
import EditorCore from "@/app/editorCore";
import React, { useEffect, useState } from "react";
import { DocItem } from "@/app/PageType";
import { Operator } from "@/app/scheme";
import { List, Avatar, ButtonGroup, Button } from '@douyinfe/semi-ui';

export default function EditorCtx({ operator, docList, setOperator }: { operator: Operator, docList: DocItem[], setOperator: (operator: Operator) => void }) {
  const [curDoc, setCurDoc] = useState<DocItem>({ id: '', title: '', content: [] });
  const [doc, setDoc] = useState<DocItem[]>(docList); // initialize from props
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
      console.log('123:', data);
      setDoc(data);
    })
    .catch(error => {
     console.error('Error creating file:', error);
    });
  };

  const selectedDoc = (e: any, item: DocItem) => {
    e.preventDefault();
    setOperatorState(Operator.EditDoc);
    setOperator(Operator.EditDoc);
    console.log('item.content', item);
    setCurDoc(item);
  }

  useEffect(() => {
    if (!docList || docList.length === 0) {
      getDocsList();
    }
  }, [])

  return (
    <div className="title">
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
                  <Button>删除</Button>
                  <Button>更多</Button>
                </ButtonGroup>
              }
              onClick={(e) => selectedDoc(e, item)}>
            </List.Item>
          }
          />
        )
      }
      {
        operatorState === Operator.EditDoc && (
          <EditorCore id={curDoc.id} title={curDoc.title} content={curDoc.content}/>
        )
      }
    </div>
  );
}
