import { NextRequest, NextResponse } from 'next/server';
import pool from '../../db';
import { prisma } from '../../db';
import { logger, Logger } from '@/utils/logger'; // 同时导入Logger类

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
// 在Next.js App Router中，我们需要使用Params来获取路由参数
// 在Next.js App Router中，我们需要使用Params来获取路由参数
// 删除这行重复的导入语句
// import { NextRequest, NextResponse } from 'next/server'; // 删除这行

// 保留下面的DELETE方法实现，但修改参数类型
// 如果已经在文件顶部导入了NextRequest和NextResponse，这里不需要再导入

// 修改DELETE方法以正确处理路由参数
export async function DELETE(request: Request) { // 修改参数类型为Request
  const startTime = Date.now();
  try {
    // 从URL中提取ID - 使用更可靠的方式
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // 提取URL中的ID（支持/api/docs/18格式）
    const match = pathname.match(/\/api\/docs\/(\d+)/);
    
    if (!match) {
      const duration = Date.now() - startTime;
      apiLogger.warn('DELETE请求URL格式不正确');
      apiLogger.logApiRequest('DELETE', pathname, 400, duration);
      return NextResponse.json({
        msg: "URL格式不正确，应为/api/docs/{id}",
        status: 400
      }, { status: 400 });
    }
    
    const id = match[1];
    
    if (!id || isNaN(Number(id))) {
      const duration = Date.now() - startTime;
      apiLogger.warn(`DELETE请求无效的文档ID: ${id}`);
      apiLogger.logApiRequest('DELETE', pathname, 400, duration);
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
      apiLogger.logApiRequest('DELETE', pathname, 404, duration);
      return NextResponse.json({
        msg: "文档不存在",
        status: 404
      }, { status: 404 });
    }
    
    // 删除文档
    await prisma.docs.delete({ where: { id: numericId } });
    
    const duration = Date.now() - startTime;
    apiLogger.info(`删除文档成功: ID=${numericId}, 标题="${doc.title}"`);
    apiLogger.logApiRequest('DELETE', pathname, 200, duration);
    
    return NextResponse.json({
      msg: "文档删除成功",
      status: 200
    }, { status: 200 });
  } catch (error) {
    const duration = Date.now() - startTime;
    const pathname = new URL(request.url).pathname;
    apiLogger.error('删除文档失败', error as Error);
    apiLogger.logApiRequest('DELETE', pathname, 500, duration);
    return NextResponse.json({
      msg: "删除文档失败",
      status: 500
    }, { status: 500 });
  }
}
