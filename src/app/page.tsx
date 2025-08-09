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
import { useChatStore } from "@/app/store/chatStore";


const Page = () => {
  const { chatTabType } = useChatStore()
  const [curDoc, setCurDoc] = useState<DocItem>({ id: '', title: '', content: [] });

  const [operator, setOperator] = useState<Operator>(Operator.AllDoc);
  const [copilotOpen, setCopilotOpen] = useState(false);

  const [docList, setDocList] = useState<DocItem[]>([]);

  useEffect(() => {
    console.log('chatTabType:', chatTabType);
    setCopilotOpen(chatTabType)
  }, [chatTabType]);

  const exportDoc = (data: DocItem) => {
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

  return (
    <>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={12} style={{ width: '160px', minWidth: '160px', maxWidth: '160px' }}>
          <SiderBar exportDoc={exportDoc}
           exportDocList={exportDocList}
           setOperator={setOperator}
           openCopilot={() => setCopilotOpen(true)} />
        </Panel>
        <PanelResizeHandle/>
        <Panel>
          <EditorCtx operator={operator} docList={docList} setOperator={setOperator}/>
        </Panel>
        <PanelResizeHandle />
        <Copilot copilotOpen={copilotOpen} setCopilotOpen={() => setCopilotOpen(false)} />
      </PanelGroup>
    </>
  )
}

export default  Page;

