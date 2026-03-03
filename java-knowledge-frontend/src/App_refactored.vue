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
          <!-- 加载状态 -->
          <div v-if="isLoadingContent" class="loading-state">
            <div class="loading-spinner"></div>
            <p>加载中...</p>
          </div>
          
          <!-- 知识讲解 -->
          <div v-show="activeTab === 'description' && !isLoadingContent" class="modal-content description-content">
            {{ selectedKnowledge?.description }}
          </div>
          
          <!-- 代码示例 -->
          <div v-show="activeTab === 'code' && !isLoadingContent" class="modal-content code-content">
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
                  @click="openKnowledgeDetail(block)"
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
import { usePanorama } from './composables/usePanorama'
import { useHighlight } from './composables/useHighlight'

// Markdown 渲染器
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})

// 使用组合式函数
const { 
  panoramaCategory, 
  showPanorama, 
  selectedKnowledge, 
  showKnowledgeModal,
  architectureLayers,
  isLoadingContent,
  showPanoramaView, 
  closePanorama, 
  openKnowledgeDetail, 
  closeKnowledgeModal 
} = usePanorama()

const { highlightCode } = useHighlight()

// 本地状态
const searchQuery = ref('')
const selectedCategory = ref<KnowledgeNode | null>(null)
const selectedArticle = ref<KnowledgeNode | null>(null)
const activeTab = ref<'description' | 'code'>('description')

// 当前日期
const currentDate = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

// 过滤后的分类
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

// 渲染的文章内容
const renderedContent = computed(() => {
  if (!selectedArticle.value) return ''
  return md.render(selectedArticle.value.name)
})

// 选择分类
const selectCategory = (category: KnowledgeNode) => {
  selectedCategory.value = category
  selectedArticle.value = null
}

// 选择文章
const selectArticle = (article: KnowledgeNode) => {
  selectedArticle.value = article
}

// 返回分类列表
const backToCategories = () => {
  selectedCategory.value = null
  selectedArticle.value = null
}

// 返回知识点列表
const backToPoints = () => {
  selectedArticle.value = null
}

// 搜索处理
const handleSearch = () => {
  // 搜索逻辑已在 computed 中处理
}
</script>

<style scoped>
/* 加载状态样式 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--border-color);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state p {
  font-size: 16px;
  margin: 0;
}

/* 此处省略样式代码，保持原有样式不变 */
/* 为了简洁，样式部分保持原样 */
</style>

