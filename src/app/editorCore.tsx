'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { Plate, usePlateEditor } from 'platejs/react';
import { EditorKit } from '@/components/editor/editor-kit';
import { Editor, EditorContainer } from '@/components/ui/editor';

export default function EditorCore({ id, content }: { id: string; content: any[] }) {

  const initialValue: any[] = content ?? []

  const editor = usePlateEditor({
    plugins: EditorKit,
    value: () => {
      return  Array.isArray(initialValue) ? initialValue : [];
    },
  });

  useEffect(() => {
    // console.log('content----', content, typeof content, JSON.parse(content));
    const parseContent = JSON.parse(content)
    const parseValueCtx = JSON.parse(parseContent)
    // console.log('parseContent', JSON.parse(parseContent), typeof JSON.parse(parseContent));
    if (parseValueCtx.length > 0) {
      editor.tf.setValue(parseValueCtx)
    }
  }, [content, editor.tf]);

  const uploadText = (data: any) => {
    console.log('uploadText', data);
    fetch('/api/docs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 1,
        title: `新建文档1`,
        content: JSON.stringify(data),
        action:'update'
      }),
    })
  };

  return (
    <Plate editor={editor}
      onChange={({ value }) => {
        if (value.length > 0 && value[0].children[0].text) {
          uploadText(value)
          console.log('Editor value changed:', value);
        }

      }}>
      <EditorContainer variant="demo">
        <Editor />
      </EditorContainer>
    </Plate>
  );
}
