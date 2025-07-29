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
import { CiViewList, CiTrash, CiSettings, CiSearch, CiShare2, CiMicrophoneOn, CiChat1 } from "react-icons/ci";

const SiderBar = (props: SiderBarProps) => {
    const { exportDoc, exportDocList, openCopilot } = props;
    const { openChatTab, chatTabType } = useChatStore()

    const [doc, setDoc] = useState<DocItem[]>([]);

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

    return (<div className={styles.siderBarWrap}>

        <AvatarDemo />

        {/* <AddTips/> */}

        <Button variant="outline" size="sm" className={styles.addBtn} onClick={addDoc}>
            <IconGitBranch />
            新建文档
        </Button>

        <p className={styles['icon-box-wrap']}><CiSearch />搜索</p>

        <p className={styles['icon-box-wrap']}><CiViewList />所有文档</p>

        <p className={styles['icon-box-wrap']}><CiShare2 />知识图谱</p>

        <p className={styles['icon-box-wrap']}><CiMicrophoneOn />语音</p>

        <p className={styles['icon-box-wrap']} onClick={operatorChatTap}><CiChat1 />对话</p>

        <p className={styles['icon-box-wrap']}>日历</p>

        <p className={styles['icon-box-wrap']}><CiTrash />删除</p>

        <p className={styles['icon-box-wrap']}><CiSettings />设置</p>
    </div>)
}

export default SiderBar;

