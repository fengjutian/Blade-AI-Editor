import { NextResponse } from 'next/server';
import { prisma } from '../../../db';
import { Logger } from '@/utils/logger';

const apiLogger = Logger.getInstance({ prefix: 'API_DOCS' });

// 处理特定ID的DELETE请求
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const startTime = Date.now();
  try {
    const { id } = params;
    const numericId = Number(id);
    
    // 验证ID
    if (isNaN(numericId)) {
      const duration = Date.now() - startTime;
      apiLogger.warn(`DELETE请求无效的文档ID: ${id}`);
      apiLogger.logApiRequest('DELETE', `/api/docs/${id}`, 400, duration);
      return NextResponse.json({
        msg: "无效的文档ID",
        status: 400
      }, { status: 400 });
    }
    
    // 检查文档是否存在
    const doc = await prisma.docs.findUnique({ where: { id: numericId } });
    if (!doc) {
      const duration = Date.now() - startTime;
      apiLogger.warn(`DELETE请求文档不存在: ID=${numericId}`);
      apiLogger.logApiRequest('DELETE', `/api/docs/${id}`, 404, duration);
      return NextResponse.json({
        msg: "文档不存在",
        status: 404
      }, { status: 404 });
    }
    
    // 删除文档
    await prisma.docs.delete({ where: { id: numericId } });
    
    const duration = Date.now() - startTime;
    apiLogger.info(`删除文档成功: ID=${numericId}, 标题="${doc.title}"`);
    apiLogger.logApiRequest('DELETE', `/api/docs/${id}`, 200, duration);
    
    return NextResponse.json({
      msg: "文档删除成功",
      status: 200
    }, { status: 200 });
  } catch (error) {
    const duration = Date.now() - startTime;
    const { id } = (request as any).params || { id: 'unknown' };
    apiLogger.error('删除文档失败', error as Error);
    apiLogger.logApiRequest('DELETE', `/api/docs/${id}`, 500, duration);
    return NextResponse.json({
      msg: "删除文档失败",
      status: 500
    }, { status: 500 });
  }
}