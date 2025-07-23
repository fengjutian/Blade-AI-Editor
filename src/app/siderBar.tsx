import styles from './siderBar.module.css';
import { Button } from "@/components/ui/button";
import { IconGitBranch } from "@tabler/icons-react";
import React, { useState } from "react";
import { DocItem, SiderBarProps } from "@/app/PageType";
// import readData from "@/utils/readData";
// import readData from "../../readData";
import { useEffect } from "react";


const SiderBar = (props: SiderBarProps) => {
    const { exportDoc} = props;

    const [doc, setDoc] = useState<DocItem[]>([
        {
            title: '文档1',
            id: 'doc1',
            content: [
                {
                    "children": [
                        {
                            "text": "2222先色氨酸"
                        }
                    ],
                    "type": "p",
                    "id": "uFH2jD2HJl"
                }
            ]
        },
        // {
        //     title: '文档2',
        //     id: 'doc2',
        //     content: [
        //         {
        //             children: [{ text: 'Title' }],
        //             type: 'h3',
        //         },
        //         {
        //         children: [{ text: 'This is a quote.' }],
        //         type: 'blockquote',
        //         },
        //         {
        //         children: [
        //             { text: 'With some ' },
        //             { bold: true, text: 'bold' },
        //             { text: ' text for emphasis!' },
        //         ],
        //         type: 'p',
        //         },
        //     ]
        // }
    ]);

    // 获取文档列表
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
            

            // message.success('File created successfully');
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

            // message.success('File created successfully');
        })
        .catch(error => {
         console.error('Error creating file:', error);

        });
    }

    useEffect(() => {
        getDocsList();
        // getStaticProps();
        getFilesList();
    }, [])


    // 新建文档
    const addDoc = () => {
        // setDoc([...doc, { title: `文档${doc.length + 1}`, id: `doc${doc.length + 1}` }]);
        console.log('add doc');

    };

    const selectedDoc = (item: DocItem) => {
        console.log('selected doc', item);
        item.content = JSON.parse(item?.content);
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

