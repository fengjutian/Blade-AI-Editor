'use client';

import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels"
import React, { useEffect, useState } from "react";
import { DocItem } from "@/app/PageType";
import SiderBar from "./siderBar";
import EditorCore from "./editorCore";
import styles from './page.module.css';
import EditorCtx from "@/pages/EditorCtx";

const Page = () => {
  const [doc, setDoc] = useState<DocItem[]>([]);
  const [curDoc, setCurDoc] = useState<DocItem>({ id: '', title: '', content: [] });

  const exportDoc = (data: DocItem) => {
    console.log('export doc', data);
    setCurDoc(data);
  };

  useEffect(() => {
    fetch('/api/user')
    .then(response => response.json())
    .then(data => {
      console.log('data', data);
    })
  }, []);


  return (
    <>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={12} style={{ width: '160px', maxWidth: '160px' }}>
          <SiderBar exportDoc={exportDoc}/>
        </Panel>
        <PanelResizeHandle/>
        <Panel>
          <EditorCtx/>
          {/* <EditorCore id={curDoc.id}  content={curDoc.content}/> */}
        </Panel>
        <PanelResizeHandle />
        {/* <Panel defaultSize={12} style={{ border: '1px solid red' }}>
          right1111
        </Panel> */}
      </PanelGroup>
    </>
  )
}

export default  Page;

