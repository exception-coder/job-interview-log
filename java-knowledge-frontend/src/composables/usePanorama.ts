import { ref, computed } from 'vue'
import type { KnowledgeNode } from '../data/knowledgeTree'
import { getPanoramaConfig } from '../data/panorama'
import type { ArchitectureLayer, KnowledgeBlock } from '../data/types'
import { loadBlockContent } from '../data/content'

/**
 * 知识图谱业务逻辑
 */
export function usePanorama() {
  // 当前选中的全景分类
  const panoramaCategory = ref<KnowledgeNode | null>(null)
  
  // 是否显示全景视图
  const showPanorama = ref(false)
  
  // 选中的知识块
  const selectedKnowledge = ref<any>(null)
  
  // 是否显示知识块模态框
  const showKnowledgeModal = ref(false)
  
  // 内容加载状态
  const isLoadingContent = ref(false)

  /**
   * 架构层次数据（根据当前分类动态获取）
   */
  const architectureLayers = computed<ArchitectureLayer[]>(() => {
    if (!panoramaCategory.value) return []
    
    const config = getPanoramaConfig(panoramaCategory.value.id)
    return config?.layers || []
  })

  /**
   * 显示全景视图
   */
  function showPanoramaView(category: KnowledgeNode) {
    panoramaCategory.value = category
    showPanorama.value = true
  }

  /**
   * 关闭全景视图
   */
  function closePanorama() {
    showPanorama.value = false
    panoramaCategory.value = null
  }

  /**
   * 打开知识块详情（支持动态加载）
   */
  async function openKnowledgeDetail(block: KnowledgeBlock) {
    // 如果有 contentFile，从独立文件加载内容
    if (block.contentFile) {
      isLoadingContent.value = true
      showKnowledgeModal.value = true
      
      // 先显示加载状态
      selectedKnowledge.value = {
        title: block.title,
        description: '加载中...',
        code: '// 加载中...'
      }
      
      try {
        const content = await loadBlockContent(block.contentFile)
        if (content) {
          selectedKnowledge.value = {
            title: content.title,
            description: content.description,
            code: content.code
          }
        } else {
          selectedKnowledge.value = {
            title: block.title,
            description: '内容加载失败',
            code: '// 内容加载失败'
          }
        }
      } catch (error) {
        console.error('Failed to load content:', error)
        selectedKnowledge.value = {
          title: block.title,
          description: '内容加载失败',
          code: '// 内容加载失败'
        }
      } finally {
        isLoadingContent.value = false
      }
    } else {
      // 兼容旧格式：如果没有 contentFile，使用内联数据
      const blockWithContent = block as any
      
      if (blockWithContent.description && blockWithContent.code) {
        selectedKnowledge.value = {
          title: block.title,
          description: blockWithContent.description,
          code: blockWithContent.code
        }
      } else if (blockWithContent.content) {
        // 自动拆分 content 字段
        const content = blockWithContent.content
        const codeMarkers = ['**代码示例：**', '**代码示例:**', '代码示例：', '代码示例:']
        let splitIndex = -1
        let marker = ''
        
        for (const m of codeMarkers) {
          const index = content.indexOf(m)
          if (index !== -1) {
            splitIndex = index
            marker = m
            break
          }
        }
        
        if (splitIndex !== -1) {
          const description = content.substring(0, splitIndex).trim()
          const code = content.substring(splitIndex + marker.length).trim()
          selectedKnowledge.value = {
            title: block.title,
            description: description,
            code: code
          }
        } else {
          selectedKnowledge.value = {
            title: block.title,
            description: content,
            code: '// 暂无代码示例'
          }
        }
      } else {
        selectedKnowledge.value = {
          title: block.title,
          description: '暂无内容',
          code: '// 暂无代码示例'
        }
      }
      
      showKnowledgeModal.value = true
    }
  }

  /**
   * 关闭知识块模态框
   */
  function closeKnowledgeModal() {
    showKnowledgeModal.value = false
    selectedKnowledge.value = null
  }

  return {
    // 状态
    panoramaCategory,
    showPanorama,
    selectedKnowledge,
    showKnowledgeModal,
    architectureLayers,
    isLoadingContent,
    
    // 方法
    showPanoramaView,
    closePanorama,
    openKnowledgeDetail,
    closeKnowledgeModal
  }
}

