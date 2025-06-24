import styles from './siderBar.module.css';
import { Button } from "@/components/ui/button";
import { IconGitBranch } from "@tabler/icons-react";
import React, { useState } from "react";


const SiderBar = () => {

    const [doc, setDoc] = useState<{ title: string; id: string }[]>([
        {
            title: '文档1',
            id: 'doc1'
        },
        {
            title: '文档2',
            id: 'doc2'
        }
    ]);




    // 新建文档
    const addDoc = () => {
        console.log('add doc');
    };

    return (<div className={styles.siderBarWrap}>
        <Button variant="outline" size="sm" className={styles.addBtn} onClick={addDoc}>
            <IconGitBranch />
            新建文档
        </Button>

        {
            doc.map((item, index) => (
                <div key={index} className={styles.docItem}>
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

