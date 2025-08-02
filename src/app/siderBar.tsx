'use client';
import styles from './siderBar.module.css';
import { Button } from "@/components/ui/button";
import { IconGitBranch } from "@tabler/icons-react";
import React, { useState } from "react";
import { DocItem, SiderBarProps } from "@/app/PageType";
import { useEffect } from "react";
import AvatarDemo from "@/app/widgets/AvatarDemo/AvatarDemo";
import AddTips from "@/app/widgets/AddTips/index";
import { useChatStore } from "@/app/store/chatStore";
import { Modal } from 'antd';
import { CiViewList, CiTrash, CiSettings, CiSearch, CiShare2, CiMicrophoneOn, CiChat1 } from "react-icons/ci";
import Setting from "@/app/widgets/Setting/index";
import Search from "@/app/widgets/Search/index";

const SiderBar = (props: SiderBarProps) => {
    const { exportDoc, exportDocList, openCopilot } = props;
    const { openChatTab, chatTabType } = useChatStore()

    const [doc, setDoc] = useState<DocItem[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const operatorChatTap = () => {
        openChatTab(!chatTabType);
    }

    const getDocsList = () => {
        fetch('/api/docs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
        .then(data => {
            console.log('123:', data);

            setDoc(data);
            exportDocList(data)
        })
        .catch(error => {
         console.error('Error creating file:', error);

        });
    };

    const getFilesList = async () => {
        fetch('/api/files', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
        .then(data => {
            console.log('File created:', data);
            if(data.status === 200){

            }
        })
        .catch(error => {
         console.error('Error creating file:', error);

        });
    }

    useEffect(() => {
        getDocsList();
        getFilesList();
    }, [])

    const addDoc = () => {
        fetch('/api/docs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: `新建文档`,
                content: [],
                action:'create'
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('File created:', data);
            if(data.status === 200){
                const newDoc = { title: `新建文档`, id: data.id, content: [] };
                setDoc([...doc, newDoc]);
                exportDocList([...doc, newDoc]);
            }
        })
        .catch(error => {
            console.error('Error creating file:', error);
        });
    };

    return (
      <div className={styles.siderBarWrap}>
        {/* 搜索 */}
        <Search isOpen={isSearchModalOpen} closeOpen={() => setIsSearchModalOpen(false)} />

        {/* 设置 */}
        <Setting isOpen={isModalOpen} closeOpen={() => setIsModalOpen(false)} />


        <AvatarDemo />

        {/* <AddTips/> */}

        <div className={styles['siderBar-ctx-wrap']}>
          <div>
              <Button variant="outline" size="sm" className={styles.addBtn} onClick={addDoc}>
                  <IconGitBranch />
                  新建文档
              </Button>

              <p className={styles['icon-box-wrap']} onClick={() => setIsSearchModalOpen(true)}><CiSearch />搜索</p>

              <p className={styles['icon-box-wrap']}><CiViewList />所有文档</p>

              <p className={styles['icon-box-wrap']}><CiShare2 />知识图谱</p>

              <p className={styles['icon-box-wrap']}><CiMicrophoneOn />语音</p>

              <p className={styles['icon-box-wrap']} onClick={operatorChatTap}><CiChat1 />对话</p>

              <p className={styles['icon-box-wrap']}>日历</p>

              <p className={styles['icon-box-wrap']}>词典</p>

              <p className={styles['icon-box-wrap']}>消息</p>
          </div>
          <div className={styles['siderBar-bottom-wrap']}>
            <p className={styles['icon-box-wrap']}><CiTrash />删除</p>
            <p className={styles['icon-box-wrap']} onClick={showModal}><CiSettings />设置</p>
          </div>
        </div>
    </div>)
}

export default SiderBar;

