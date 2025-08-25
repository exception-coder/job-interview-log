<template>
  <div class="content-viewer">
    <div v-if="!article" class="welcome-screen">
      <div class="welcome-content">
        <div class="welcome-icon">☕</div>
        <h1 class="welcome-title">欢迎来到 Java 知识库</h1>
        <p class="welcome-subtitle">精选面试高频知识点，助你轻松应对技术面试</p>
        <div class="welcome-features">
          <div class="feature-card">
            <span class="feature-icon">📚</span>
            <h3>系统化学习</h3>
            <p>从基础到进阶，完整的知识体系</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">🎯</span>
            <h3>面试导向</h3>
            <p>聚焦高频考点，提高面试通过率</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">⚡</span>
            <h3>快速查阅</h3>
            <p>清晰的分类，快速找到所需内容</p>
          </div>
        </div>
        <div class="quick-start">
          <p class="quick-start-text">👈 从左侧菜单选择一个知识点开始学习</p>
        </div>
      </div>
    </div>

    <div v-else class="article-container">
      <div class="breadcrumb">
        <span class="breadcrumb-item">首页</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item">{{ article.category }}</span>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item active">{{ article.name }}</span>
      </div>

      <article class="article-content">
        <header class="article-header">
          <h1 class="article-title">{{ article.name }}</h1>
          <div class="article-meta">
            <span class="meta-item">
              <span class="meta-icon">📁</span>
              {{ article.category }}
            </span>
            <span class="meta-item">
              <span class="meta-icon">📅</span>
              最后更新: {{ currentDate }}
            </span>
          </div>
        </header>

        <div class="markdown-body" v-html="renderedContent"></div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import type { KnowledgeNode } from '../data/knowledgeTree'

const props = defineProps<{
  article: (KnowledgeNode & { category?: string }) | null
}>()

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})

const currentDate = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

const renderedContent = computed(() => {
  if (!props.article?.path) {
    return ''
  }
  
  // 模拟内容，实际应该从文件系统读取
  const mockContent = `
# ${props.article.name}

## 概述

这是关于 **${props.article.name}** 的详细介绍。

## 核心概念

### 1. 基本定义

\`\`\`java
// 示例代码
public class Example {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
\`\`\`

### 2. 关键特性

- 特性一：详细说明
- 特性二：详细说明
- 特性三：详细说明

### 3. 使用场景

在实际开发中，我们经常会遇到以下场景：

1. 场景一
2. 场景二
3. 场景三

## 面试要点

> 💡 **面试官常问**：请解释一下这个概念的核心原理？

**参考答案**：

这个知识点的核心在于...

## 最佳实践

\`\`\`java
// 推荐的写法
public void bestPractice() {
    // 实现代码
}
\`\`\`

## 常见陷阱

⚠️ **注意**：在使用时要避免以下问题：

- 陷阱1
- 陷阱2
- 陷阱3

## 总结

通过本文的学习，你应该掌握了...

## 相关资源

- [官方文档](https://docs.oracle.com/javase/)
- [深入理解JVM](https://book.douban.com/)
`
  
  return md.render(mockContent)
})
</script>

<style scoped>
.content-viewer {
  flex: 1;
  height: 100vh;
  overflow-y: auto;
  background: var(--bg-primary);
}

.welcome-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px;
}

.welcome-content {
  max-width: 900px;
  text-align: center;
  animation: fadeIn 0.6s ease;
}

.welcome-icon {
  font-size: 80px;
  margin-bottom: 24px;
  animation: fadeIn 0.8s ease;
  filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.3));
}

.welcome-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fadeIn 1s ease;
}

.welcome-subtitle {
  font-size: 20px;
  color: var(--text-secondary);
  margin-bottom: 48px;
  animation: fadeIn 1.2s ease;
}

.welcome-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.feature-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 32px 24px;
  transition: all 0.3s ease;
  animation: fadeIn 1.4s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--accent-primary);
}

.feature-icon {
  font-size: 40px;
  display: block;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.feature-card p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.quick-start {
  animation: fadeIn 1.6s ease;
}

.quick-start-text {
  font-size: 16px;
  color: var(--text-secondary);
  padding: 16px 24px;
  background: var(--bg-secondary);
  border-radius: 8px;
  border-left: 4px solid var(--accent-primary);
}

.article-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px;
  animation: fadeIn 0.4s ease;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  font-size: 14px;
  color: var(--text-muted);
}

.breadcrumb-item {
  transition: color 0.2s;
}

.breadcrumb-item:not(.active):hover {
  color: var(--accent-primary);
  cursor: pointer;
}

.breadcrumb-item.active {
  color: var(--text-primary);
  font-weight: 500;
}

.breadcrumb-separator {
  color: var(--border-color);
}

.article-content {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 48px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
}

.article-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid var(--border-color);
}

.article-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--text-primary);
  line-height: 1.3;
}

.article-meta {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--text-secondary);
}

.meta-icon {
  font-size: 16px;
}

.markdown-body {
  color: var(--text-primary);
  line-height: 1.8;
  font-size: 16px;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4) {
  color: var(--text-primary);
  font-weight: 600;
  margin-top: 32px;
  margin-bottom: 16px;
  line-height: 1.4;
}

.markdown-body :deep(h1) {
  font-size: 32px;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 12px;
}

.markdown-body :deep(h2) {
  font-size: 28px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 8px;
}

.markdown-body :deep(h3) {
  font-size: 22px;
}

.markdown-body :deep(p) {
  margin-bottom: 16px;
}

.markdown-body :deep(code) {
  background: var(--bg-tertiary);
  padding: 2px 8px;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: #e06c75;
}

.markdown-body :deep(pre) {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  margin: 16px 0;
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
  padding: 16px 20px;
  margin: 16px 0;
  border-radius: 4px;
}

.markdown-body :deep(blockquote p) {
  margin: 0;
}

.markdown-body :deep(a) {
  color: var(--accent-primary);
  text-decoration: none;
  transition: color 0.2s;
}

.markdown-body :deep(a:hover) {
  color: var(--accent-secondary);
  text-decoration: underline;
}

.markdown-body :deep(strong) {
  color: var(--text-primary);
  font-weight: 600;
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid var(--border-color);
  padding: 12px;
  text-align: left;
}

.markdown-body :deep(th) {
  background: var(--bg-tertiary);
  font-weight: 600;
}
</style>

