import pool from '../../db';
import { NextResponse } from 'next/server'

export async function GET(request) {
  return new Response("hello", {
    status: 200,
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
