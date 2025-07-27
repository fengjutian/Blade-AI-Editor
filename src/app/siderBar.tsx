'use client';
import styles from './siderBar.module.css';
import { Button } from "@/components/ui/button";
import { IconGitBranch } from "@tabler/icons-react";
import React, { useState } from "react";
import { DocItem, SiderBarProps } from "@/app/PageType";
import { useEffect } from "react";
import { Accordion, Avatar  } from "radix-ui";
import AvatarDemo from "@/app/widgets/AvatarDemo/AvatarDemo";
import AddTips from "@/app/widgets/AddTips/index";


const SiderBar = (props: SiderBarProps) => {
    const { exportDoc, exportDocList } = props;

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
        setDoc([...doc, { title: `新建文档`, id: `doc${doc.length + 1}`,content: [] }]);
        exportDocList([...doc, { title: `新建文档`, id: `doc${doc.length + 1}`,content: []}])

        fetch('/api/doc/createDoc', {
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
    };

    return (<div className={styles.siderBarWrap}>

        <AvatarDemo />

        <AddTips/>

        <div>所有文档</div>

        <Button variant="outline" size="sm" className={styles.addBtn} onClick={addDoc}>
            <IconGitBranch />
            新建文档
        </Button>

        <p>对话</p>

        <p>日历</p>

    </div>)
}

export default SiderBar;

