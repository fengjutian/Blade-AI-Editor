'use client';

import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels"
import React, { useEffect, useState } from "react";
import { DocItem } from "@/app/PageType";
import SiderBar from "./siderBar";
import EditorCtx from "@/pages/EditorCtx";
import { Operator } from "@/app/scheme";
import { Copilot } from "@/app/ai-chat/assistant-chat/page";
import { Familjen_Grotesk } from "next/font/google";

const Page = () => {
  const [curDoc, setCurDoc] = useState<DocItem>({ id: '', title: '', content: [] });

  const [operator, setOperator] = useState<Operator>(Operator.AllDoc);

  const [docList, setDocList] = useState<DocItem[]>([]);

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

  const exportDocList = (data: DocItem[]) => {
    setDocList(data);
  };

    const [copilotOpen, setCopilotOpen] = useState(false);


  return (
    <>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={12} style={{ width: '160px', maxWidth: '160px' }}>
          <SiderBar exportDoc={exportDoc}  exportDocList={exportDocList} openCopilot={() => setCopilotOpen(true)} />
        </Panel>
        <PanelResizeHandle/>
        <Panel>
          <EditorCtx operator={operator} docList={docList}/>
        </Panel>
        <PanelResizeHandle />
        {/* <Panel defaultSize={12} style={{ border: '1px solid red' }}>
          right1111
        </Panel> */}
         <Copilot copilotOpen={copilotOpen} setCopilotOpen={() => setCopilotOpen(false)} />
      </PanelGroup>

    
    </>
  )
}

export default  Page;

