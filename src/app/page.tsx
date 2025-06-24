'use client';

import SiderBar from "./siderBar";
import EditorCore from "./editorCore";
import styles from './page.module.css';


// const Page = () => {
//   return (
//   <div className={styles['ctx-flex']}>
//     <SiderBar/>
//     <EditorCore id='1'/>
//   </div>)
// }

// export default Page;

import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from "react-resizable-panels"

const Page = () => {
  return (
    <>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={12} style={{ background: '#f0f0f0', border: '1px solid red' }}>
          <SiderBar/>
        </Panel>
        <PanelResizeHandle/>
        <Panel style={{ border: '1px solid red' }}>
          <EditorCore id='1'/>
        </Panel>
        <PanelResizeHandle />
        <Panel defaultSize={12} style={{ border: '1px solid red' }}>
          right1111
        </Panel>
      </PanelGroup>
    </>
  )
}

export default  Page;

