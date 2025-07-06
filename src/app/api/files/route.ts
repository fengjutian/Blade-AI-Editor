import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
 
// export default function handler(req, res) {
//     const filePath = path.join(process.cwd(), 'public', 'newFile.txt');
//     const content = 'This is a new file created by Next.js.';
//     fs.writeFile(filePath, content, 'utf8', (err) => {
//         if (err) {
//             res.status(500).json({ error: 'Failed to write the file' });
//             return;
//         }
//         res.status(200).json({ message: 'File written successfully' });
//     });
// }

export async function GET(request: Request) {
    const dirPath = path.join(process.cwd(), 'public', 'docs'); // 指定目录路径
    console.log('读取目录:', dirPath);
    try {
    // 读取目录（返回 Dirent 对象数组）
    const dirents = await fs.readdirSync(dirPath, { withFileTypes: true });
        console.log('读取目录成功:', dirPath);
        // 过滤出文件
        const filesList =  dirents.filter(dirent => dirent.isFile())
        .map(dirent => dirent.name);

        // 读取文件内容
        console.log('读取文件列表:', filesList);

        //  return new Response({
        //     data: filesList,
        //     msg: "读取文件成功",
        //     code: 200
        // });

        //  return NextResponse.json(
        //     {data: filesList},
        //     {msg: "读取文件成功"},
        //     { status: 200 }
        // );

        return NextResponse.json(
            {data: filesList, msg: "读取文件成功", status: 200}
        );
    } catch (err) {
        console.error('读取失败:', err);
        return [];
    }
}


export async function POST(request: Request, res: Response) {
    const time = new Date()
    const fileName = `/docs/newFile-${time.getTime()}.md`;
    const filePath = path.join(process.cwd(), 'public', fileName);
    const content = 'This is a new file created by Next.js.';
    fs.writeFile(filePath, content, 'utf8', (err) => {
        if (err) {
            res.status(500).json({ error: 'Failed to write the file' });
            return;
        }
        res.status(200).json({ message: 'File written successfully' });

        return new Response("hello", {
            status: 200,
        });
    });

    return new Response("创建文件成功", {
        status: 200,
    });
}
