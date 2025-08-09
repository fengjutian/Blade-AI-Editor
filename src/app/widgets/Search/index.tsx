'use client';
import React, { useEffect } from 'react'
import { Command } from 'cmdk';  // 添加 Command 组件导入
import styles from "./styles.module.css";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

const Search: React.FC<{ isOpen: boolean, onOpenChange: (open: boolean) => void }> = ({ isOpen, onOpenChange }) => {
  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!isOpen)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [isOpen, onOpenChange])

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
                  risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor
                  quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
                  risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor
                  quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor
                  adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit
                  officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                  nisi consectetur esse laborum eiusmod pariatur proident Lorem eiusmod et. Culpa
                  deserunt nostrud ad veniam.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
      // <Modal
      //   title="20px to Top"
      //   style={{ top: 20 }}
      //   open={isOpen}
      //   onOk={() => onOpenChange(false)}
      //   onCancel={() => onOpenChange(false)}
      // >

      //   {/* <Command.Dialog open={true} onOpenChange={onOpenChange}
      //     label="Global Command Menu" className={styles.dialog}>
      //     <Command.Input className={styles.input} />
      //     <Command.List className={styles.list}>
      //       <Command.Empty className={styles.empty}>No results found.</Command.Empty>

      //       <Command.Group heading="Letters" className={styles.group}>
      //         <Command.Item className={styles.item}>a</Command.Item>
      //         <Command.Item className={styles.item}>b</Command.Item>
      //         <Command.Separator className={styles.separator} />
      //         <Command.Item className={styles.item}>c</Command.Item>
      //       </Command.Group>

      //       <Command.Item className={styles.item}>Apple</Command.Item>
      //     </Command.List>
      //   </Command.Dialog> */}

      //   <Command>
      //     <Command.Input />
      //     <Command.List>
      //       <Command.Item>Apple</Command.Item>
      //     </Command.List>
      //   </Command>

      // </Modal>

  )
}




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

// import * as Popover from '@radix-ui/react-popover'
// import { Command } from 'cmdk'

// const Search = () => {
//   return (
//     <Popover.Root>
//       <Popover.Trigger>Toggle popover</Popover.Trigger>

//       <Popover.Content>
//         <Command>
//           <Command.Input />
//           <Command.List>
//             <Command.Item>Apple</Command.Item>
//           </Command.List>
//         </Command>
//       </Popover.Content>
//     </Popover.Root>
//   )
// }



export default Search;
