export interface DocItem {
    title: string;
    id: string;
    content: { children: ({ text: string; bold?: boolean })[]; type: string }[];// 文档内容
}

export interface SiderBarProps {
    docList?: { title: string; id: string }[];
    addItemDoc?: () => void;
    exportDoc: (data: DocItem) => void;
    exportDocList: (data: any) => void;
    openCopilot: (data: boolean) => void;
}
