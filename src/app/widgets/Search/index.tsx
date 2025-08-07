'use client';
import React, { useEffect } from 'react'
// import { Command } from 'cmdk';  // 添加 Command 组件导入
import styles from "./styles.module.css";
import { Modal } from 'antd';

// const Search: React.FC<{ isOpen: boolean, onOpenChange: (open: boolean) => void }> = ({ isOpen, onOpenChange }) => {
//   // Toggle the menu when ⌘K is pressed
//   useEffect(() => {
//     const down = (e) => {
//       if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
//         e.preventDefault()
//         onOpenChange(!isOpen)
//       }
//     }

//     document.addEventListener('keydown', down)
//     return () => document.removeEventListener('keydown', down)
//   }, [isOpen, onOpenChange])

//   return (
//       <Modal
//         title="20px to Top"
//         style={{ top: 20 }}
//         open={isOpen}
//         onOk={() => onOpenChange(false)}
//         onCancel={() => onOpenChange(false)}
//       >

//         <Command.Dialog open={true} onOpenChange={onOpenChange}
//           label="Global Command Menu" className={styles.dialog}>
//           <Command.Input className={styles.input} />
//           <Command.List className={styles.list}>
//             <Command.Empty className={styles.empty}>No results found.</Command.Empty>

//             <Command.Group heading="Letters" className={styles.group}>
//               <Command.Item className={styles.item}>a</Command.Item>
//               <Command.Item className={styles.item}>b</Command.Item>
//               <Command.Separator className={styles.separator} />
//               <Command.Item className={styles.item}>c</Command.Item>
//             </Command.Group>

//             <Command.Item className={styles.item}>Apple</Command.Item>
//           </Command.List>
//         </Command.Dialog>

//       </Modal>

//   )
// }




// import { Command } from 'cmdk'

// const Search = () => {
//   const [open, setOpen] = React.useState(true)

//   // Toggle the menu when ⌘K is pressed
//   React.useEffect(() => {
//     const down = (e) => {
//       if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
//         e.preventDefault()
//         setOpen((open) => !open)
//       }
//     }

//     document.addEventListener('keydown', down)
//     return () => document.removeEventListener('keydown', down)
//   }, [])

//   return (
//     <Command.Dialog open={open} onOpenChange={setOpen} label="Global Command Menu">
//       <Command.Input />
//       <Command.List>
//         <Command.Empty>No results found.</Command.Empty>

//         <Command.Group heading="Letters">
//           <Command.Item>a</Command.Item>
//           <Command.Item>b</Command.Item>
//           <Command.Separator />
//           <Command.Item>c</Command.Item>
//         </Command.Group>

//         <Command.Item>Apple</Command.Item>
//       </Command.List>
//     </Command.Dialog>
//   )
// }

import * as Popover from '@radix-ui/react-popover'
import { Command } from 'cmdk'

const Search = () => {
  return (
    <Popover.Root>
      <Popover.Trigger>Toggle popover</Popover.Trigger>

      <Popover.Content>
        <Command>
          <Command.Input />
          <Command.List>
            <Command.Item>Apple</Command.Item>
          </Command.List>
        </Command>
      </Popover.Content>
    </Popover.Root>
  )
}



export default Search;
