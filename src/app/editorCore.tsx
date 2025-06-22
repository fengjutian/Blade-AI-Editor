'use client';

import * as React from 'react';

import { Plate, usePlateEditor } from 'platejs/react';

import { EditorKit } from '@/components/editor/editor-kit';
import { Editor, EditorContainer } from '@/components/ui/editor';

// import { DEMO_VALUES } from './values/demo-values';

export default function EditorCore({ id }: { id: string }) {

  const initialValue: any = [
    {
      children: [{ text: 'Title' }],
      type: 'h3',
    },
    {
      children: [{ text: 'This is a quote.' }],
      type: 'blockquote',
    },
    {
      children: [
        { text: 'With some ' },
        { bold: true, text: 'bold' },
        { text: ' text for emphasis!' },
      ],
      type: 'p',
    },
  ];

  const editor = usePlateEditor({
    plugins: EditorKit,
    value: () => {
      const savedValue = localStorage.getItem(
        `nextjs-plate-value-demo-${new Date().toISOString().split('T')[0]}`
      );
      return savedValue ? JSON.parse(savedValue) : initialValue;
    },
  });

  return (
    <Plate editor={editor} 
      onChange={({ value }) => {
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
