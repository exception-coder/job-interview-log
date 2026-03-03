#!/usr/bin/env python3
"""
从 App.vue 中提取知识图谱数据并生成独立的内容文件
"""

import re
import os

def extract_blocks_from_app_vue():
    """从 App.vue 中提取知识块数据"""
    
    app_vue_path = '/Users/zhangkai/IdeaProjects/job-interview-log/java-knowledge-frontend/src/App.vue'
    
    with open(app_vue_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 查找 architectureLayers 部分
    pattern = r"if \(panoramaCategory\.value\.id === 'java-concurrent'\) \{[\s\S]*?return \[\]"
    match = re.search(pattern, content)
    
    if not match:
        print("❌ 未找到 java-concurrent 数据")
        return
    
    java_concurrent_data = match.group(0)
    
    # 提取所有的 blocks
    block_pattern = r'\{[\s\S]*?id: [\'"]([^\'"]+)[\'"][\s\S]*?title: [\'"]([^\'"]+)[\'"][\s\S]*?subtitle: [\'"]([^\'"]+)[\'"][\s\S]*?(?:description|content): `([\s\S]*?)`[\s\S]*?(?:code: `([\s\S]*?)`)?[\s\S]*?\}'
    
    blocks = re.findall(block_pattern, java_concurrent_data)
    
    print(f"✅ 找到 {len(blocks)} 个知识块")
    
    return blocks

def create_content_file(block_id, title, subtitle, description, code):
    """创建内容文件"""
    
    output_dir = '/Users/zhangkai/IdeaProjects/job-interview-log/java-knowledge-frontend/src/data/content/java-concurrent'
    os.makedirs(output_dir, exist_ok=True)
    
    # 文件名：使用 block_id
    filename = f"{block_id}.ts"
    filepath = os.path.join(output_dir, filename)
    
    # 生成内容
    content_var_name = block_id.replace('-', '_') + 'Content'
    
    # 处理 description 和 code
    if not code:
        code = '// 暂无代码示例'
    
    file_content = f"""import type {{ KnowledgeBlockContent }} from '../../types'

/**
 * {title} - 详细内容
 */
export const {content_var_name}: KnowledgeBlockContent = {{
  id: '{block_id}',
  title: '{title}',
  description: `{description}`,
  code: `{code}`
}}
"""
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(file_content)
    
    print(f"✅ 创建文件: {filename}")
    
    return filename

def update_content_loader(filenames):
    """更新内容加载器"""
    
    loader_path = '/Users/zhangkai/IdeaProjects/job-interview-log/java-knowledge-frontend/src/data/content/index.ts'
    
    # 生成导入映射
    imports = []
    for filename in filenames:
        block_id = filename.replace('.ts', '')
        imports.append(f"  'java-concurrent/{block_id}': () => import('./java-concurrent/{block_id}'),")
    
    imports_str = '\n'.join(imports)
    
    content = f"""import type {{ KnowledgeBlockContent }} from '../types'

/**
 * 内容加载器
 * 根据内容文件路径动态加载知识块的详细内容
 */

// 内容文件映射表
const contentModules: Record<string, () => Promise<{{ [key: string]: KnowledgeBlockContent }}>> = {{
{imports_str}
}}

/**
 * 加载知识块内容
 * @param contentFile 内容文件路径（相对于 content/ 目录）
 * @returns 知识块详细内容
 */
export async function loadBlockContent(contentFile: string): Promise<KnowledgeBlockContent | null> {{
  try {{
    const loader = contentModules[contentFile]
    if (!loader) {{
      console.warn(`Content file not found: ${{contentFile}}`)
      return null
    }}
    
    const module = await loader()
    // 获取模块中导出的第一个内容对象
    const content = Object.values(module)[0] as KnowledgeBlockContent
    return content
  }} catch (error) {{
    console.error(`Failed to load content: ${{contentFile}}`, error)
    return null
  }}
}}

/**
 * 批量预加载内容
 * @param contentFiles 内容文件路径数组
 */
export async function preloadContents(contentFiles: string[]): Promise<void> {{
  const promises = contentFiles.map(file => loadBlockContent(file))
  await Promise.all(promises)
}}

/**
 * 检查内容文件是否存在
 * @param contentFile 内容文件路径
 */
export function hasContent(contentFile: string): boolean {{
  return contentFile in contentModules
}}
"""
    
    with open(loader_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ 更新内容加载器: {loader_path}")

def main():
    print("=" * 60)
    print("从 App.vue 提取知识图谱数据")
    print("=" * 60)
    print()
    
    # 提取数据
    blocks = extract_blocks_from_app_vue()
    
    if not blocks:
        print("❌ 没有找到数据")
        return
    
    print()
    print("开始创建内容文件...")
    print()
    
    filenames = []
    
    # 创建内容文件
    for block_id, title, subtitle, description, code in blocks:
        try:
            filename = create_content_file(block_id, title, subtitle, description, code)
            filenames.append(filename)
        except Exception as e:
            print(f"❌ 创建 {block_id} 失败: {e}")
    
    print()
    print("更新内容加载器...")
    print()
    
    # 更新加载器
    update_content_loader(filenames)
    
    print()
    print("=" * 60)
    print(f"✅ 完成！共创建 {len(filenames)} 个内容文件")
    print("=" * 60)
    print()
    print("下一步:")
    print("1. 检查生成的内容文件")
    print("2. 更新 panorama/javaConcurrent.ts，添加 contentFile 字段")
    print("3. 测试动态加载功能")

if __name__ == '__main__':
    main()

