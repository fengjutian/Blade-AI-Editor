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
    const { exportDoc} = props;

    const [doc, setDoc] = useState<DocItem[]>([
        // {
        //     title: '文档1',
        //     id: 'doc1',
        //     content: [
        //         {
        //             "children": [
        //                 {
        //                     "text": "2222先色氨酸"
        //                 }
        //             ],
        //             "type": "p",
        //             "id": "uFH2jD2HJl"
        //         }
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
    };

    const selectedDoc = (item: DocItem) => {
        console.log('selected doc', item.content);

        // const content = JSON.parse(s);
        item.content = JSON.parse(item?.content);

        console.log('item', item);
        exportDoc(item);
    }

    return (<div className={styles.siderBarWrap}>

        <AvatarDemo />

        <AddTips/>



        <div>所有文档</div>

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

    {/* <Accordion.Root type="single">
		<Accordion.Item value="item-1">
			<Accordion.Header>
				<Accordion.Trigger className="AccordionTrigger">
					<span>Trigger text</span>

				</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Content>…</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root> */}

    </div>)
}

export default SiderBar;

