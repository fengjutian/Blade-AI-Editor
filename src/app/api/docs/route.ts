import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import pool from '../../db'; // 添加 pool 导入

const prisma = new PrismaClient();

export async function GET() {
  try {
    const docs = await prisma.docs.findMany();
    return NextResponse.json(docs, { status: 200 }); // 统一使用 NextResponse
  } catch (error) {
    console.error('获取文档列表失败', error);
    return NextResponse.json({ msg: "获取文档列表失败" }, { status: 500 });
  }
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

      console.log(123456, newDoc)
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
    return NextResponse.json({ msg: "操作失败" }, { status: 500 });
  }
}

// 修复 DELETE 方法的参数获取方式
// 在 Next.js App Router 中，动态路由参数需要通过 params 获取
// 但由于这是在 route.ts 中，我们需要使用不同的方式获取 ID

export async function DELETE(request: Request) {
  try {
    // 从 URL 中提取 ID
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop(); // 获取 URL 最后一部分作为 ID
    
    if (!id) {
      return NextResponse.json({
        msg: "缺少文档 ID",
        status: 400
      }, { status: 400 });
    }
    
    // 检查文档是否存在
    const doc = await prisma.docs.findUnique({ where: { id } });
    if (!doc) {
      return NextResponse.json({
        msg: "文档不存在",
        status: 404
      }, { status: 404 });
    }
    
    // 删除文档
    await prisma.docs.delete({ where: { id } });
    
    return NextResponse.json({
      msg: "文档删除成功",
      status: 200
    }, { status: 200 });
  } catch (error) {
    console.error('删除文档失败', error);
    return NextResponse.json({
      msg: "删除文档失败",
      status: 500
    }, { status: 500 });
  }
}
