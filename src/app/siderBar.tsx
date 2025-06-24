import styles from './siderBar.module.css';
import { Button } from "@/components/ui/button";
import { IconGitBranch } from "@tabler/icons-react";
import React, { useState } from "react";
import { DocItem, SiderBarProps } from "@/app/PageType";


const SiderBar = (props: SiderBarProps) => {
    const { exportDoc} = props;

    const [doc, setDoc] = useState<DocItem[]>([
        {
            title: '文档1',
            id: 'doc1',
            content: [
                {
                    children: [{ text: 'Title1111111' }],
                    type: 'h3',
                },
                {
                    children: [{ text: 'This is a quote.1111' }],
                    type: 'blockquote',
                },
                {
                children: [
                    { text: 'With some 11111111' },
                    { bold: true, text: 'bold' },
                    { text: ' text for emphasis!' },
                ],
                type: 'p',
                },
            ]
        },
        {
            title: '文档2',
            id: 'doc2',
            content: [
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
            ]
        }
    ]);


    // 新建文档
    const addDoc = () => {
        // setDoc([...doc, { title: `文档${doc.length + 1}`, id: `doc${doc.length + 1}` }]);
        console.log('add doc');

    };

    const selectedDoc = (item: DocItem) => {
        console.log('selected doc', item);
        exportDoc(item);
    }

    return (<div className={styles.siderBarWrap}>
        <Button variant="outline" size="sm" className={styles.addBtn} onClick={addDoc}>
            <IconGitBranch />
            新建文档
        </Button>

        {
            doc.map((item, index) => (
                <div key={index} className={styles.docItem} onClick={() => selectedDoc(item)}>
                    <span className={styles.docTitle}>{item.title}</span>
                    <Button variant="ghost" size="icon" className={styles.closeBtn} onClick={() => {
                        const newDoc = doc.filter((_, i) => i !== index);
                        setDoc(newDoc);
                    }}>
                        X
                    </Button>
                </div>
            ))
        }

    </div>)
}

export default SiderBar;

