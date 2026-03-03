/**
 * 知识图谱相关类型定义
 */

// 知识块（只包含元数据，不包含详细内容）
export interface KnowledgeBlock {
  id: string
  title: string
  subtitle: string
  contentFile?: string  // 内容文件路径（相对于 content/ 目录）
}

// 知识块详细内容（从独立文件加载）
export interface KnowledgeBlockContent {
  id: string
  title: string
  description: string  // 知识讲解
  code: string        // 代码示例
}

// 架构层次
export interface ArchitectureLayer {
  name: string
  blocks: KnowledgeBlock[]
}

// 知识图谱配置
export interface PanoramaConfig {
  categoryId: string
  layers: ArchitectureLayer[]
}
