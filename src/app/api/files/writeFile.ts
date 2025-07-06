import fs from 'fs';
import path from 'path';
 
export default function handler(req, res) {
    const filePath = path.join(process.cwd(), 'public', 'newFile.txt');
    const content = 'This is a new file created by Next.js.';
    fs.writeFile(filePath, content, 'utf8', (err) => {
        if (err) {
            res.status(500).json({ error: 'Failed to write the file' });
            return;
        }
        res.status(200).json({ message: 'File written successfully' });
    });
}