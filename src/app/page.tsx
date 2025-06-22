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
        <Panel>
          left
        </Panel>
        <PanelResizeHandle />
        <Panel>
          <PanelGroup direction="vertical">
            <Panel>
              top
            </Panel>
            <PanelResizeHandle />
            <Panel>
              <PanelGroup direction="horizontal">
                <Panel>
                  left
                </Panel>
                <PanelResizeHandle />
                <Panel>
                  right
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle />
        <Panel>
          right
        </Panel>
      </PanelGroup>
    </>
  )
}

export default  Page;

