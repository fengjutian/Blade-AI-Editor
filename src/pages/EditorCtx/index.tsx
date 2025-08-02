'use client';

import './index.module.css';
import EditorCore from "@/app/editorCore";
import React, { use, useEffect, useState } from "react";
import { DocItem } from "@/app/PageType";
import { Operator } from "@/app/scheme";
import { List } from '@douyinfe/semi-ui';

export default function EditorCtx({ operator, docList, setOperator }: { operator: Operator, docList: DocItem[], setOperator: (operator: Operator) => void }) {
  const [curDoc, setCurDoc] = useState<DocItem>({ id: '', title: '', content: [] });
  const [doc, setDoc] = useState<DocItem[]>(docList); // initialize from props
  const [operatorState, setOperatorState] = useState<Operator>(operator);

  useEffect(() => {
    console.log('operator1111111111111', operator);
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

  const selectedDoc = (item: DocItem) => {
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
            renderItem={item => <List.Item onClick={() => selectedDoc(item)}>{item.title}</List.Item>}
          />
        )
      }

      {
        operatorState === Operator.EditDoc && (
          <EditorCore id={curDoc.id}  content={curDoc.content}/>
        )
      }
    </div>
  );
}
