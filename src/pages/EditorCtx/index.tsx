'use client';

import './index.module.css';
import EditorCore from "@/app/editorCore";
import React, { useEffect, useState } from "react";
import { DocItem } from "@/app/PageType";
import { Button } from "@/components/ui/button";
import styles from './index.module.css';
import { Operator } from "@/app/scheme";
import { List } from '@douyinfe/semi-ui';

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

      item.content = Array.isArray(item?.content) ? [] : JSON.parse(item?.content);

      console.log('item', item);
      // exportDoc(item);

      setOperatorState(Operator.EditDoc);
      setCurDoc(item);
  }

  useEffect(() => {
      getDocsList();
  }, [])

  return (
    <div className="title">

      {/* {
        operatorState === Operator.AllDoc && (
          doc.map((item, index) => (
              <div key={index} className={styles.docItem} onClick={() => selectedDoc(item)}>
                  <span className={styles.docTitle}>{item.title}</span>
                  <Button variant="ghost" size="icon" className={styles.closeBtn} onClick={() => {
                      const newDoc = doc.filter((_, i) => i !== index);
                      setDoc(newDoc);
                  }}>
                    X
                  </Button>
              </div>
          ))
        )
      } */}

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
