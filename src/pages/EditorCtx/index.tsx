import './index.module.css';
import EditorCore from "@/app/editorCore";
import React, { useEffect, useState } from "react";
import { DocItem } from "@/app/PageType";

export default function EditorCtx() {
  const [curDoc, setCurDoc] = useState<DocItem>({ id: '', title: '', content: [] });
  return <div className="title">
    <EditorCore id={curDoc.id}  content={curDoc.content}/> 
  </div>;
}
