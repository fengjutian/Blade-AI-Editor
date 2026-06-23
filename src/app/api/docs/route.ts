import { NextRequest, NextResponse } from 'next/server';
// 只保留一种数据库访问方式
import { prisma } from '../../db';
// 移除 mysql2 连接池的导入
// import pool from '../../db';
import { logger, Logger } from '@/utils/logger';

// 使用Logger类创建实例
const apiLogger = Logger.getInstance({ prefix: 'API_DOCS' });

export async function GET() {
  const startTime = Date.now();
  try {
    const docs = await prisma.docs.findMany();
    const duration = Date.now() - startTime;
    apiLogger.logApiRequest('GET', '/api/docs', 200, duration);
    return NextResponse.json(docs, { status: 200 });
  } catch (error) {
    const duration = Date.now() - startTime;
    apiLogger.error('获取文档列表失败', error as Error);
    apiLogger.logApiRequest('GET', '/api/docs', 500, duration);
    return NextResponse.json({ msg: "获取文档列表失败" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const body = await request.json();

    // 保留原有的查询文档接口
    // 删除对 mysql2 连接池的使用
    // 修改 query action 部分
    if (body.action === 'query') {
    // 使用 Prisma 替代 mysql2 连接池
    const rows = await prisma.docs.findMany();
    const duration = Date.now() - startTime;
    apiLogger.logApiRequest('POST', '/api/docs?action=query', 200, duration);
    return NextResponse.json({data: rows, msg: "查询文档成功", status: 200 });
    }
    
    // 新的创建文档功能
    if (body.action === 'create') {
      const { title, content } = body;
      
      // 检查标题是否已存在
      const existingDoc = await prisma.docs.findUnique({
        where: { title }
      });
      
      if (existingDoc) {
        const duration = Date.now() - startTime;
        apiLogger.warn(`创建文档失败：标题"${title}"已存在`);
        apiLogger.logApiRequest('POST', '/api/docs?action=create', 400, duration);
        return NextResponse.json({
          msg: "文档标题已存在",
          status: 400
        }, { status: 400 });
      }
      
      const newDoc = await prisma.docs.create({
        data: {
          title,
          content: JSON.stringify(content),
        },
      });

      const duration = Date.now() - startTime;
      apiLogger.info(`创建文档成功：ID=${newDoc.id}, 标题="${newDoc.title}"`);
      apiLogger.logApiRequest('POST', '/api/docs?action=create', 200, duration);
      
      return NextResponse.json({
        data: newDoc,
        msg: "文档创建成功",
        status: 200
      });
    }

    // 编辑文档功能
    if (body.action === 'update') {
      const { id, title, content } = body;
      
      // 检查文档是否存在
      const existingDoc = await prisma.docs.findUnique({
        where: { id }
      });
      
      if (!existingDoc) {
        const duration = Date.now() - startTime;
        apiLogger.warn(`更新文档失败：ID=${id}的文档不存在`);
        apiLogger.logApiRequest('POST', '/api/docs?action=update', 404, duration);
        return NextResponse.json({
          msg: "文档不存在",
          status: 404
        }, { status: 404 });
      }
      
      // 检查标题是否与其他文档冲突
      if (title !== existingDoc.title) {
        const titleExists = await prisma.docs.findUnique({
          where: { title }
        });
        
        if (titleExists) {
          const duration = Date.now() - startTime;
          apiLogger.warn(`更新文档失败：标题"${title}"已被其他文档使用`);
          apiLogger.logApiRequest('POST', '/api/docs?action=update', 400, duration);
          return NextResponse.json({
            msg: "文档标题已存在",
            status: 400
          }, { status: 400 });
        }
      }
      
      const updatedDoc = await prisma.docs.update({
        where: { id },
        data: {
          title,
          content: JSON.stringify(content)
        },
      });
      
      const duration = Date.now() - startTime;
      apiLogger.info(`更新文档成功：ID=${updatedDoc.id}, 标题="${updatedDoc.title}"`);
      apiLogger.logApiRequest('POST', '/api/docs?action=update', 200, duration);
      
      return NextResponse.json({
        data: updatedDoc,
        msg: "文档更新成功",
        status: 200
      });
    }
    
    // 如果没有匹配的action
    const duration = Date.now() - startTime;
    apiLogger.warn('无效的请求action');
    apiLogger.logApiRequest('POST', '/api/docs', 400, duration);
    return NextResponse.json({ msg: "无效的请求参数" }, { status: 400 });
  } catch (error) {
    const duration = Date.now() - startTime;
    apiLogger.error('操作失败', error as Error);
    apiLogger.logApiRequest('POST', '/api/docs', 500, duration);
    return NextResponse.json({ msg: "操作失败" }, { status: 500 });
  }
}

