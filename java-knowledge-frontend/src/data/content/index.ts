import type { KnowledgeBlockContent } from '../types'

/**
 * 内容加载器
 * 根据内容文件路径动态加载知识块的详细内容
 */

// 内容文件映射表
const contentModules: Record<string, () => Promise<{ [key: string]: KnowledgeBlockContent }>> = {
  // Java并发
  'java-concurrent/thread-types': () => import('./java-concurrent/thread-types'),
  'java-concurrent/thread-states': () => import('./java-concurrent/thread-states'),
  'java-concurrent/synchronized': () => import('./java-concurrent/synchronized'),
  // 可以继续添加其他内容文件...
}

/**
 * 加载知识块内容
 * @param contentFile 内容文件路径（相对于 content/ 目录）
 * @returns 知识块详细内容
 */
export async function loadBlockContent(contentFile: string): Promise<KnowledgeBlockContent | null> {
  try {
    const loader = contentModules[contentFile]
    if (!loader) {
      console.warn(`Content file not found: ${contentFile}`)
      return null
    }
    
    const module = await loader()
    // 获取模块中导出的第一个内容对象
    const content = Object.values(module)[0] as KnowledgeBlockContent
    return content
  } catch (error) {
    console.error(`Failed to load content: ${contentFile}`, error)
    return null
  }
}

/**
 * 批量预加载内容
 * @param contentFiles 内容文件路径数组
 */
export async function preloadContents(contentFiles: string[]): Promise<void> {
  const promises = contentFiles.map(file => loadBlockContent(file))
  await Promise.all(promises)
}

/**
 * 检查内容文件是否存在
 * @param contentFile 内容文件路径
 */
export function hasContent(contentFile: string): boolean {
  return contentFile in contentModules
}

