'use client';

import * as React from 'react';
import { useEffect } from 'react';

import { Plate, usePlateEditor } from 'platejs/react';

import { EditorKit } from '@/components/editor/editor-kit';
import { Editor, EditorContainer } from '@/components/ui/editor';

import { setNodes } from 'slate';

export default function EditorCore({ id, content }: { id: string; content: any[] }) {
  const [value, setValue] = React.useState<any[]>([]);


  const initialValue: any = content

  const editor = usePlateEditor({
    plugins: EditorKit,
    value: () => {
      return  initialValue;
    },
  });


  const docRender = () => {

  }

  useEffect(() => {
    // 使用 setNodes 替换整个文档内容
    if (content.length > 0) {
      editor.tf.setValue(content)
    }
  }, [content]);

  return (
    <Plate editor={editor}
      onChange={({ value }) => {
        console.log('Editor value changed:', value);
        localStorage.setItem(
          `nextjs-plate-value-demo-${new Date().toISOString().split('T')[0]}`,
          JSON.stringify(value)
        );
      }}>
      <EditorContainer variant="demo">
        <Editor />
      </EditorContainer>
    </Plate>
  );
}
