import pool from '../../db';
import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET() {

  const docs = await prisma.docs.findMany();
  return new Response(JSON.stringify(docs), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(request: Request, res: Response) {
    try {
      const [rows] = await pool.query('SELECT * FROM docs_list');
      console.log('接口调用',rows);
      return NextResponse.json({data: rows, msg: "查询文档成功", status: 200 });
      // res.status(200).json({data: rows, msg: "查询文档成功", status: 200});
    } catch (error) {
      console.log('查询文档失败',error);
      // res.status(500).json({ error: error.message });

      return new Response("查询文档失败", {
          status: 500,
      });
    }
}
