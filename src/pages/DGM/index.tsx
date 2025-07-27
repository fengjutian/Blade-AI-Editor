'use client';

import { Editor } from "@dgmjs/core";
import { DGMEditor } from "@dgmjs/react";

function DGMCtx() {
  const handleMount = async (editor: Editor) => {
    editor.newDoc();
    editor.fitToScreen();
    window.addEventListener("resize", () => {
      editor.fit();
    });
  };

  return (
    <DGMEditor
      className="absolute inset-0 border rounded-lg"
      onMount={handleMount}
    />
  );
}

export default DGMCtx;
