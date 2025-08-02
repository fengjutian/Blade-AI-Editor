import { NextResponse } from 'next/server';
import pool from '../../db';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET() {

  const docs = await prisma.docs.findMany();
  return new Response(JSON.stringify(docs), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(request: Request) {
    try {
      const body = await request.json();

      // 保留原有的查询文档接口
      if (body.action === 'query') {
        const [rows] = await pool.query('SELECT * FROM docs_list');
        return NextResponse.json({data: rows, msg: "查询文档成功", status: 200 });
      }
      
      // 新的创建文档功能
      if (body.action === 'create') {
        const { title, content } = body;
        const newDoc = await prisma.docs.create({
          data: {
            title,
            content: JSON.stringify(content),
          },
        });
        return NextResponse.json({
          data: newDoc,
          msg: "文档创建成功",
          status: 200
        });
      }

      // 编辑文档功能
      if (body.action === 'update') {
        const { id, title, content } = body;
        const updatedDoc = await prisma.docs.update({
          where: { id },
          data: {
            title,
            content: JSON.stringify(content)
          },
        });
        return NextResponse.json({
          data: updatedDoc,
          msg: "文档更新成功",
          status: 200
        });
      }
    } catch (error) {
      console.error('操作失败', error);
      return new Response("操作失败", {
          status: 500,
      });
    }
}
