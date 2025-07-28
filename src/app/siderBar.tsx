'use client';
import styles from './siderBar.module.css';
import { Button } from "@/components/ui/button";
import { IconGitBranch } from "@tabler/icons-react";
import React, { useState } from "react";
import Link from 'next/link';
import { DocItem, SiderBarProps } from "@/app/PageType";
import { useEffect } from "react";
import { Accordion, Avatar  } from "radix-ui";
import AvatarDemo from "@/app/widgets/AvatarDemo/AvatarDemo";
import AddTips from "@/app/widgets/AddTips/index";
import { useChatStore } from "@/chat/store/ChatStore";

const SiderBar = (props: SiderBarProps) => {
    const { exportDoc, exportDocList, openCopilot } = props;

    const [doc, setDoc] = useState<DocItem[]>([]);

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
                // 后端创建成功后再更新前端状态
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

        <AddTips/>

        <div>所有文档</div>

        <Button variant="outline" size="sm" className={styles.addBtn} onClick={addDoc}>
            <IconGitBranch />
            新建文档
        </Button>

     
        <p onClick={() => openCopilot(true)}>对话</p>


        <p>日历</p>


        <p>设置</p>
    </div>)
}

export default SiderBar;

