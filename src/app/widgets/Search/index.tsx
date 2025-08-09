'use client';
import React, { useEffect } from 'react'
import { Command } from 'cmdk';  // 添加 Command 组件导入
import styles from "./styles.module.css";
import { Modal, Button } from '@douyinfe/semi-ui';
import {
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";

const Search: React.FC<{ isOpen: boolean, onOpenChange: (open: boolean) => void }> = ({ isOpen, onOpenChange }) => {
  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: any) => {
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
      <Modal
        title=""
        visible={isOpen}
        onOk={onOpenChange}
        afterClose={onOpenChange} //>=1.16.0
        onCancel={onOpenChange}
        closeOnEsc={true}
      >
      <Command value='apple'>
          <Command.Input />
           <Command.List>
             <Command.Item>Apple</Command.Item>
           </Command.List>
         </Command>

      </Modal>
    </>
  )
}




export default Search;
