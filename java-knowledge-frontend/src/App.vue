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

    <main class="main-content">
      <!-- 分类卡片网格 -->
      <transition name="fade" mode="out-in">
        <div v-if="!selectedCategory && !selectedArticle" class="category-grid">
          <div 
            v-for="category in filteredCategories" 
            :key="category.id"
            class="category-card"
            :style="{ animationDelay: `${category.id.length * 20}ms` }"
            @click="selectCategory(category)"
          >
            <div class="card-icon">{{ category.icon }}</div>
            <h2 class="card-title">{{ category.name }}</h2>
            <p class="card-count">{{ category.children?.length || 0 }} 个知识点</p>
            <div class="card-hover-effect"></div>
          </div>
        </div>

        <!-- 知识点列表 -->
        <div v-else-if="selectedCategory && !selectedArticle" class="knowledge-points">
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
        <div v-else-if="selectedArticle" class="article-view">
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
      </transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MarkdownIt from 'markdown-it'
import { knowledgeTree, type KnowledgeNode } from './data/knowledgeTree'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})

const searchQuery = ref('')
const selectedCategory = ref<KnowledgeNode | null>(null)
const selectedArticle = ref<KnowledgeNode | null>(null)

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
</style>
