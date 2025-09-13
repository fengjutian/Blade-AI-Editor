import { NextResponse } from 'next/server'; // 添加NextResponse导入
import pool from '../../db';
import { prisma } from '../../db'; // 从db.ts导入prisma
import { logger, Logger } from '@/utils/logger'; // 修改导入，同时导入Logger类

// 为API路由创建专用的日志实例 - 修复这里
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
    if (body.action === 'query') {
      const [rows] = await pool.query('SELECT * FROM docs_list');
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

// 修复 DELETE 方法
// 在Next.js App Router中，动态路由应该在单独的[id]目录下
// 但由于这是在route.ts中，我们需要使用动态路由参数

export async function DELETE(request: Request) {
  const startTime = Date.now();
  try {
    // 从URL中提取ID
    const url = new URL(request.url);
    // 获取URL路径段，找到最后一个有效段作为ID
    const pathSegments = url.pathname.split('/').filter(segment => segment !== '');
    // 找到'docs'后面的ID段
    const docsIndex = pathSegments.indexOf('docs');
    
    if (docsIndex === -1 || docsIndex === pathSegments.length - 1) {
      const duration = Date.now() - startTime;
      apiLogger.warn('DELETE请求缺少文档ID');
      apiLogger.logApiRequest('DELETE', url.pathname, 400, duration);
      return NextResponse.json({
        msg: "缺少文档ID",
        status: 400
      }, { status: 400 });
    }
    
    const id = pathSegments[docsIndex + 1];
    
    if (!id || isNaN(Number(id))) {
      const duration = Date.now() - startTime;
      apiLogger.warn(`DELETE请求无效的文档ID: ${id}`);
      apiLogger.logApiRequest('DELETE', url.pathname, 400, duration);
      return NextResponse.json({
        msg: "无效的文档ID",
        status: 400
      }, { status: 400 });
    }
    
    // 转换ID为数字类型
    const numericId = Number(id);
    
    // 检查文档是否存在
    const doc = await prisma.docs.findUnique({ where: { id: numericId } });
    if (!doc) {
      const duration = Date.now() - startTime;
      apiLogger.warn(`DELETE请求文档不存在: ID=${numericId}`);
      apiLogger.logApiRequest('DELETE', url.pathname, 404, duration);
      return NextResponse.json({
        msg: "文档不存在",
        status: 404
      }, { status: 404 });
    }
    
    // 删除文档
    await prisma.docs.delete({ where: { id: numericId } });
    
    const duration = Date.now() - startTime;
    apiLogger.info(`删除文档成功: ID=${numericId}, 标题="${doc.title}"`);
    apiLogger.logApiRequest('DELETE', url.pathname, 200, duration);
    
    return NextResponse.json({
      msg: "文档删除成功",
      status: 200
    }, { status: 200 });
  } catch (error) {
    const duration = Date.now() - startTime;
    apiLogger.error('删除文档失败', error as Error);
    apiLogger.logApiRequest('DELETE', new URL(request.url).pathname, 500, duration);
    return NextResponse.json({
      msg: "删除文档失败",
      status: 500
    }, { status: 500 });
  }
}
