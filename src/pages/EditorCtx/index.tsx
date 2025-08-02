'use client';

import './index.module.css';
import EditorCore from "@/app/editorCore";
import React, { useEffect, useState } from "react";
import { DocItem } from "@/app/PageType";
import { Operator } from "@/app/scheme";
import { List } from '@douyinfe/semi-ui';
// import DGMCtx from '@/pages/DGM/index';
// import dynamic from 'next/dynamic';

// const DGMCtx = dynamic(() => import('@/pages/DGM/index'), { ssr: false });

export default function EditorCtx({ operator, docList }: { operator: Operator, docList: DocItem[] }) {
  const [curDoc, setCurDoc] = useState<DocItem>({ id: '', title: '', content: [] });
  const [doc, setDoc] = useState<DocItem[]>(docList); // initialize from props

  const [operatorState, setOperatorState] = useState<Operator>(operator);

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
    console.log('selected doc', item.content);

      // item.content = item?.content ? JSON.parse(item?.content) : [];

      console.log('item', item);
      // exportDoc(item);

      setOperatorState(Operator.EditDoc);

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
