<template>
  <div class="card-grid-layout">
    <header class="app-header">
      <div class="header-content">
        <div class="logo-section">
          <span class="logo-icon">☕</span>
          <h1 class="app-title">Java 知识库</h1>
        </div>
        <div class="search-section">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="搜索知识点..."
            class="global-search"
            @input="handleSearch"
          />
          <span class="search-icon">🔍</span>
        </div>
      </div>
    </header>

    <!-- 知识点模态框 -->
    <div v-if="showKnowledgeModal" class="knowledge-modal-overlay" @click="closeKnowledgeModal">
      <div class="knowledge-modal" @click.stop>
        <button class="modal-close" @click="closeKnowledgeModal">✕</button>
        <h2 class="modal-title">{{ selectedKnowledge?.title }}</h2>
        
        <!-- 标签页切换 -->
        <div class="modal-tabs">
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'description' }"
            @click="activeTab = 'description'"
          >
            📖 知识讲解
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'code' }"
            @click="activeTab = 'code'"
          >
            💻 代码示例
          </button>
        </div>
        
        <!-- 内容区域 -->
        <div class="modal-content-wrapper">
          <!-- 知识讲解 -->
          <div v-show="activeTab === 'description'" class="modal-content description-content">
            {{ selectedKnowledge?.description }}
          </div>
          
          <!-- 代码示例 -->
          <div v-show="activeTab === 'code'" class="modal-content code-content">
            <pre><code class="language-java" v-html="highlightCode(selectedKnowledge?.code || '')"></code></pre>
          </div>
        </div>
      </div>
    </div>

    <main class="main-content">
      <!-- 分类卡片网格 -->
      <transition name="fade" mode="out-in">
        <div v-if="!selectedCategory && !selectedArticle && !showPanorama" key="categories" class="category-grid">
          <div 
            v-for="category in filteredCategories" 
            :key="category.id"
            class="category-card"
            :style="{ animationDelay: `${category.id.length * 20}ms` }"
          >
            <div class="card-content" @click="selectCategory(category)">
              <div class="card-icon">{{ category.icon }}</div>
              <h2 class="card-title">{{ category.name }}</h2>
              <p class="card-count">{{ category.children?.length || 0 }} 个知识点</p>
            </div>
            <button class="panorama-btn" @click.stop="showPanoramaView(category)">
              🗺️ 全景
            </button>
            <div class="card-hover-effect"></div>
          </div>
        </div>

        <!-- 知识点列表 -->
        <div v-else-if="selectedCategory && !selectedArticle && !showPanorama" key="points" class="knowledge-points">
          <div class="points-header">
            <button class="back-btn" @click="backToCategories">
              <span>←</span> 返回分类
            </button>
            <div class="category-info">
              <span class="category-icon-large">{{ selectedCategory.icon }}</span>
              <h2 class="category-title">{{ selectedCategory.name }}</h2>
            </div>
          </div>

          <div class="points-grid">
            <div 
              v-for="(point, index) in selectedCategory.children" 
              :key="point.id"
              class="point-card"
              :style="{ animationDelay: `${index * 50}ms` }"
              @click="selectArticle(point)"
            >
              <div class="point-number">{{ String(index + 1).padStart(2, '0') }}</div>
              <h3 class="point-title">{{ point.name }}</h3>
              <div class="point-arrow">→</div>
            </div>
          </div>
        </div>

        <!-- 文章内容 -->
        <div v-else-if="selectedArticle && !showPanorama" key="article" class="article-view">
          <div class="article-header">
            <button class="back-btn" @click="backToPoints">
              <span>←</span> 返回列表
            </button>
            <div class="article-breadcrumb">
              <span @click="backToCategories" class="breadcrumb-link">{{ selectedCategory?.name }}</span>
              <span class="breadcrumb-sep">/</span>
              <span class="breadcrumb-current">{{ selectedArticle.name }}</span>
            </div>
          </div>

          <article class="article-content">
            <h1 class="article-title">{{ selectedArticle.name }}</h1>
            <div class="article-meta">
              <span class="meta-tag">{{ selectedCategory?.name }}</span>
              <span class="meta-date">最后更新: {{ currentDate }}</span>
            </div>
            <div class="markdown-body" v-html="renderedContent"></div>
          </article>
        </div>

        <!-- 全景视图 -->
        <div v-else-if="showPanorama" key="panorama" class="panorama-view">
          <div class="panorama-header">
            <button class="back-btn" @click="closePanorama">
              <span>←</span> 返回
            </button>
            <h2 class="panorama-title">{{ panoramaCategory?.name }} - 知识架构全景</h2>
          </div>

          <div class="architecture-diagram">
            <div v-for="layer in architectureLayers" :key="layer.name" class="arch-layer">
              <h3 class="layer-title">{{ layer.name }}</h3>
              <div class="layer-blocks">
                <div 
                  v-for="block in layer.blocks" 
                  :key="block.id"
                  class="knowledge-block"
                  @click="showKnowledgeDetail(block)"
                >
                  <div class="block-title">{{ block.title }}</div>
                  <div class="block-subtitle">{{ block.subtitle }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MarkdownIt from 'markdown-it'
import { knowledgeTree, type KnowledgeNode } from './data/knowledgeTree'
import { useHighlight } from './composables/useHighlight'
import { getPanoramaConfig } from './data/panorama'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})

// 使用代码高亮 composable
const { highlightCode } = useHighlight()

const searchQuery = ref('')
const selectedCategory = ref<KnowledgeNode | null>(null)
const selectedArticle = ref<KnowledgeNode | null>(null)
const showPanorama = ref(false)
const panoramaCategory = ref<KnowledgeNode | null>(null)
const showKnowledgeModal = ref(false)
const selectedKnowledge = ref<{ title: string; description: string; code: string } | null>(null)
const activeTab = ref<'description' | 'code'>('description')

const currentDate = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) {
    return knowledgeTree
  }
  
  const query = searchQuery.value.toLowerCase()
  return knowledgeTree.filter(category => {
    const matchCategory = category.name.toLowerCase().includes(query)
    const matchChildren = category.children?.some(child => 
      child.name.toLowerCase().includes(query)
    )
    return matchCategory || matchChildren
  })
})

const selectCategory = (category: KnowledgeNode) => {
  selectedCategory.value = category
  selectedArticle.value = null
}

const selectArticle = (article: KnowledgeNode) => {
  selectedArticle.value = article
}

const backToCategories = () => {
  selectedCategory.value = null
  selectedArticle.value = null
}

const backToPoints = () => {
  selectedArticle.value = null
}

const handleSearch = () => {
  // 搜索逻辑已在 computed 中处理
}

const showPanoramaView = (category: KnowledgeNode) => {
  panoramaCategory.value = category
  showPanorama.value = true
}

const closePanorama = () => {
  showPanorama.value = false
  panoramaCategory.value = null
}

const showKnowledgeDetail = async (block: any) => {
  // 如果有 contentFile 字段，动态加载内容
  if (block.contentFile) {
    try {
      // 动态导入内容文件
      const contentModule = await import(`./data/content/${block.contentFile}`)
      // 获取导出的内容对象（假设导出名称遵循 xxxContent 格式）
      const contentKey = Object.keys(contentModule).find(key => key.endsWith('Content'))
      if (contentKey) {
        const content = contentModule[contentKey]
        selectedKnowledge.value = {
          title: block.title,
          description: content.description || '暂无内容',
          code: content.code || '// 暂无代码示例'
        }
      } else {
        throw new Error('Content not found in module')
      }
    } catch (error) {
      console.error('Failed to load content file:', block.contentFile, error)
      selectedKnowledge.value = {
        title: block.title,
        description: '内容加载失败',
        code: '// 内容加载失败'
      }
    }
  }
  // 如果已经有 description 和 code 字段，直接使用
  else if (block.description && block.code) {
    selectedKnowledge.value = {
      title: block.title,
      description: block.description,
      code: block.code
    }
  } else if (block.content) {
    // 如果只有 content 字段，自动拆分
    const content = block.content
    
    // 查找 "**代码示例：**" 或类似的标记
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
      // 找到了代码示例标记，拆分
      const description = content.substring(0, splitIndex).trim()
      const code = content.substring(splitIndex + marker.length).trim()
      
      selectedKnowledge.value = {
        title: block.title,
        description: description,
        code: code
      }
    } else {
      // 没有找到标记，全部作为描述
      selectedKnowledge.value = {
        title: block.title,
        description: content,
        code: '// 暂无代码示例'
      }
    }
  } else {
    // 没有任何内容
    selectedKnowledge.value = {
      title: block.title,
      description: '暂无内容',
      code: '// 暂无代码示例'
    }
  }
  
  activeTab.value = 'description' // 默认显示知识讲解
  showKnowledgeModal.value = true
}

const closeKnowledgeModal = () => {
  showKnowledgeModal.value = false
  selectedKnowledge.value = null
}

// 架构层次数据
const architectureLayers = computed(() => {
  if (!panoramaCategory.value) return []
  
  // 从 panorama 配置中获取数据
  const config = getPanoramaConfig(panoramaCategory.value.id)
  
  if (config) {
    // 使用新架构的配置
    return config.layers
  }
  
  // 通用处理：为其他分类自动生成全景图
  // 将知识点列表按每10个一组分层展示
  if (panoramaCategory.value.children && panoramaCategory.value.children.length > 0) {
    const children = panoramaCategory.value.children
    const layers = []
    const itemsPerLayer = 10
    
    for (let i = 0; i < children.length; i += itemsPerLayer) {
      const layerItems = children.slice(i, Math.min(i + itemsPerLayer, children.length))
      
      layers.push({
        name: `知识点 ${i + 1}-${Math.min(i + itemsPerLayer, children.length)} (共${children.length}个)`,
        blocks: layerItems.map(item => ({
          id: item.id,
          title: item.name,
          subtitle: `点击查看详情`,
          description: `**${item.name}**

这是关于"${item.name}"的知识点。

**核心要点：**
- 理解基本概念和原理
- 掌握使用场景和最佳实践
- 了解常见问题和解决方案

**面试建议：**
- 准备相关的实际案例
- 理解底层实现原理
- 能够对比相关技术的优缺点`,
          code: `// TODO: 补充具体的代码示例
// 这里展示${item.name}的基本用法

public class Demo {
    public static void main(String[] args) {
        // 示例代码
        System.out.println("${item.name}");
    }
}`
        }))
      })
    }
    
    return layers
  }
  
  return []
})
const renderedContent = computed(() => {
  if (!selectedArticle.value) return ''
  
  const mockContent = `
# ${selectedArticle.value.name}

## 概述

这是关于 **${selectedArticle.value.name}** 的详细介绍。

## 核心概念

### 1. 基本定义

\`\`\`java
// 示例代码
public class Example {
    private String name;
    
    public Example(String name) {
        this.name = name;
    }
    
    public void display() {
        System.out.println("Hello, " + name);
    }
}
\`\`\`

### 2. 关键特性

- **特性一**：提供了强大的功能支持
- **特性二**：具有良好的性能表现
- **特性三**：易于使用和维护

### 3. 使用场景

在实际开发中，我们经常会遇到以下场景：

1. **场景一**：高并发环境下的数据处理
2. **场景二**：分布式系统中的一致性保证
3. **场景三**：微服务架构中的服务治理

## 面试要点

> 💡 **面试官常问**：请解释一下这个概念的核心原理？

**参考答案**：

这个知识点的核心在于理解其底层实现机制。主要包括以下几个方面：

- 原理一：详细说明
- 原理二：详细说明
- 原理三：详细说明

## 最佳实践

\`\`\`java
// 推荐的写法
public class BestPractice {
    // 使用构造函数注入
    private final DependencyService service;
    
    public BestPractice(DependencyService service) {
        this.service = service;
    }
    
    public void execute() {
        // 实现代码
        service.process();
    }
}
\`\`\`

## 常见陷阱

⚠️ **注意**：在使用时要避免以下问题：

- **陷阱1**：忽略线程安全问题
- **陷阱2**：过度使用导致性能下降
- **陷阱3**：配置不当引发异常

## 总结

通过本文的学习，你应该掌握了 ${selectedArticle.value.name} 的核心概念和使用方法。

## 相关资源

- [官方文档](https://docs.oracle.com/javase/)
- [深入理解JVM](https://book.douban.com/)
- [Effective Java](https://book.douban.com/)
`
  
  return md.render(mockContent)
})
</script>

<style scoped>
.card-grid-layout {
  min-height: 100vh;
  background: var(--bg-primary);
  overflow-x: hidden;
  overflow-y: auto;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(17, 24, 39, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-icon {
  font-size: 36px;
  filter: drop-shadow(0 2px 8px rgba(59, 130, 246, 0.4));
}

.app-title {
  font-size: 28px;
  font-weight: 700;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.search-section {
  position: relative;
  flex: 1;
  max-width: 500px;
}

.global-search {
  width: 100%;
  padding: 12px 48px 12px 20px;
  background: var(--bg-tertiary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 15px;
  transition: all 0.3s;
}

.global-search:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.search-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  pointer-events: none;
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 40px;
}

/* 分类卡片网格 */
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  animation: fadeIn 0.5s ease;
}

.category-card {
  position: relative;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 16px;
  padding: 40px 32px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  animation: slideInUp 0.5s ease backwards;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.category-card:hover {
  transform: translateY(-8px);
  border-color: var(--accent-primary);
  box-shadow: 0 12px 32px rgba(59, 130, 246, 0.2);
}

.category-card:hover .card-hover-effect {
  opacity: 1;
}

.card-hover-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--accent-gradient);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  mix-blend-mode: overlay;
}

.card-icon {
  font-size: 56px;
  margin-bottom: 20px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.card-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.card-count {
  font-size: 14px;
  color: var(--text-muted);
}

/* 知识点列表 */
.knowledge-points {
  animation: fadeIn 0.4s ease;
}

.points-header {
  margin-bottom: 40px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 24px;
}

.back-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
  border-color: var(--accent-primary);
}

.category-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.category-icon-large {
  font-size: 64px;
  filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.4));
}

.category-title {
  font-size: 36px;
  font-weight: 700;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.points-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.point-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 28px;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  animation: slideInUp 0.4s ease backwards;
}

.point-card:hover {
  transform: translateX(8px);
  border-color: var(--accent-primary);
  background: var(--bg-tertiary);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
}

.point-card:hover .point-arrow {
  transform: translateX(4px);
  color: var(--accent-primary);
}

.point-number {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-muted);
  font-family: 'JetBrains Mono', monospace;
}

.point-title {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.point-arrow {
  font-size: 24px;
  color: var(--text-muted);
  transition: all 0.3s;
}

/* 文章视图 */
.article-view {
  animation: fadeIn 0.4s ease;
}

.article-header {
  margin-bottom: 40px;
}

.article-breadcrumb {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--text-muted);
  margin-top: 16px;
}

.breadcrumb-link {
  color: var(--accent-primary);
  cursor: pointer;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: var(--accent-secondary);
}

.breadcrumb-sep {
  color: var(--border-color);
}

.breadcrumb-current {
  color: var(--text-primary);
  font-weight: 500;
}

.article-content {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 60px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.article-title {
  font-size: 42px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 24px;
  line-height: 1.3;
}

.article-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 2px solid var(--border-color);
}

.meta-tag {
  padding: 6px 16px;
  background: var(--accent-gradient);
  color: white;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}

.meta-date {
  padding: 6px 16px;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border-radius: 6px;
  font-size: 13px;
}

.markdown-body {
  color: var(--text-primary);
  line-height: 1.8;
  font-size: 16px;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  color: var(--text-primary);
  font-weight: 600;
  margin-top: 32px;
  margin-bottom: 16px;
}

.markdown-body :deep(h2) {
  font-size: 28px;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 12px;
}

.markdown-body :deep(h3) {
  font-size: 22px;
}

.markdown-body :deep(p) {
  margin-bottom: 16px;
}

.markdown-body :deep(code) {
  background: var(--bg-tertiary);
  padding: 3px 8px;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: #e06c75;
}

.markdown-body :deep(pre) {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  overflow-x: auto;
  margin: 20px 0;
}

.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
  color: var(--text-primary);
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 16px 0;
  padding-left: 32px;
}

.markdown-body :deep(li) {
  margin: 8px 0;
}

.markdown-body :deep(blockquote) {
  border-left: 4px solid var(--accent-primary);
  background: var(--bg-tertiary);
  padding: 16px 24px;
  margin: 20px 0;
  border-radius: 4px;
}

.markdown-body :deep(strong) {
  color: var(--accent-primary);
  font-weight: 600;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .search-section {
    max-width: 100%;
  }
  
  .category-grid,
  .points-grid {
    grid-template-columns: 1fr;
  }
  
  .article-content {
    padding: 32px 24px;
  }
}

/* 全景按钮样式 */
.panorama-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 10;
}

.category-card {
  position: relative;
}

.category-card:hover .panorama-btn {
  opacity: 1;
  transform: translateY(0);
}

.panorama-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.card-content {
  cursor: pointer;
}

/* 全景视图样式 */
.panorama-view {
  padding: 40px;
  animation: fadeIn 0.5s ease;
}

.panorama-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 40px;
}

.panorama-title {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 架构图样式 */
.architecture-diagram {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.arch-layer {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.arch-layer:hover {
  transform: translateY(-4px);
}

.layer-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 3px solid var(--accent-primary);
  display: inline-block;
}

.layer-blocks {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.knowledge-block {
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.knowledge-block::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.knowledge-block:hover::before {
  transform: scaleY(1);
}

.knowledge-block:hover {
  transform: translateX(8px);
  border-color: var(--accent-primary);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
}

.block-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.block-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  opacity: 0.8;
}

/* 知识点模态框样式 */
.knowledge-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
  backdrop-filter: blur(4px);
}

.knowledge-modal {
  background: var(--bg-secondary);
  border-radius: 20px;
  padding: 40px;
  max-width: 900px;
  width: 90%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border: none;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.modal-close:hover {
  background: var(--accent-primary);
  color: white;
  transform: rotate(90deg);
}

.modal-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 20px;
  padding-right: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 标签页样式 */
.modal-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 2px solid var(--border-color);
}

.tab-btn {
  padding: 12px 24px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
}

.tab-btn:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
}

.tab-btn.active {
  color: var(--accent-primary);
  border-bottom-color: var(--accent-primary);
}

/* 内容区域 */
.modal-content-wrapper {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.modal-content {
  color: var(--text-primary);
  line-height: 1.8;
  font-size: 16px;
}

/* 知识讲解样式 */
.description-content {
  white-space: pre-line;
  padding: 20px;
}

.description-content strong {
  color: var(--accent-primary);
  font-weight: 600;
  display: block;
  margin-top: 16px;
  margin-bottom: 8px;
}

/* 代码示例样式 */
.code-content {
  padding: 0;
}

.code-content pre {
  margin: 0;
  padding: 24px;
  background: #1e1e1e;
  border-radius: 12px;
  overflow-x: auto;
}

.code-content code {
  font-family: 'JetBrains Mono', 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #d4d4d4;
  display: block;
}

/* Java 代码语法高亮 */
.code-content :deep(.keyword) {
  color: #569cd6;
  font-weight: 600;
}

.code-content :deep(.string) {
  color: #ce9178;
}

.code-content :deep(.comment) {
  color: #6a9955;
  font-style: italic;
}

.code-content :deep(.number) {
  color: #b5cea8;
}

.code-content :deep(.function) {
  color: #dcdcaa;
}

.code-content :deep(.class-name) {
  color: #4ec9b0;
}

/* 滚动条样式 */
.modal-content-wrapper::-webkit-scrollbar {
  width: 8px;
}

.modal-content-wrapper::-webkit-scrollbar-track {
  background: var(--bg-tertiary);
  border-radius: 4px;
}

.modal-content-wrapper::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

.modal-content-wrapper::-webkit-scrollbar-thumb:hover {
  background: var(--accent-primary);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .panorama-view {
    padding: 20px;
  }
  
  .layer-blocks {
    grid-template-columns: 1fr;
  }
  
  .knowledge-modal {
    margin: 20px;
    padding: 30px 20px;
    max-width: calc(100% - 40px);
  }
  
  .modal-title {
    font-size: 22px;
  }
}

</style>
