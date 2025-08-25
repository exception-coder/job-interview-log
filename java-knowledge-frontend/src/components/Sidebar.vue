<template>
  <div class="sidebar" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-header">
      <div class="logo">
        <span class="logo-icon">☕</span>
        <span v-if="!isCollapsed" class="logo-text">Java 知识库</span>
      </div>
      <button class="collapse-btn" @click="toggleCollapse" :title="isCollapsed ? '展开' : '收起'">
        <span>{{ isCollapsed ? '›' : '‹' }}</span>
      </button>
    </div>

    <div v-if="!isCollapsed" class="search-box">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="搜索知识点 Ctrl + J"
        @input="handleSearch"
        class="search-input"
      />
      <span class="search-icon">🔍</span>
    </div>

    <nav class="nav-tree">
      <div class="nav-section" v-for="node in filteredTree" :key="node.id">
        <div 
          class="nav-category"
          :class="{ active: expandedCategories.includes(node.id) }"
          @click="toggleCategory(node.id)"
        >
          <span class="category-icon">{{ node.icon }}</span>
          <span v-if="!isCollapsed" class="category-name">{{ node.name }}</span>
          <span v-if="!isCollapsed && node.children" class="expand-icon">
            {{ expandedCategories.includes(node.id) ? '▼' : '▶' }}
          </span>
        </div>
        
        <transition name="slide">
          <div 
            v-if="!isCollapsed && expandedCategories.includes(node.id) && node.children" 
            class="nav-items"
          >
            <div 
              v-for="child in node.children" 
              :key="child.id"
              class="nav-item"
              :class="{ active: selectedArticle === child.id }"
              @click="selectArticle(child)"
            >
              <span class="item-dot">•</span>
              <span class="item-name">{{ child.name }}</span>
            </div>
          </div>
        </transition>
      </div>
    </nav>

    <div v-if="!isCollapsed" class="sidebar-footer">
      <div class="footer-stats">
        <div class="stat-item">
          <span class="stat-label">知识点</span>
          <span class="stat-value">{{ totalArticles }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">分类</span>
          <span class="stat-value">{{ knowledgeTree.length }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { knowledgeTree, type KnowledgeNode } from '../data/knowledgeTree'

const emit = defineEmits<{
  selectArticle: [article: KnowledgeNode]
}>()

const isCollapsed = ref(false)
const searchQuery = ref('')
const expandedCategories = ref<string[]>(['must-read', 'java-concurrent', 'spring', 'mysql'])
const selectedArticle = ref<string>('')

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const toggleCategory = (categoryId: string) => {
  const index = expandedCategories.value.indexOf(categoryId)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(categoryId)
  }
}

const selectArticle = (article: KnowledgeNode) => {
  selectedArticle.value = article.id
  emit('selectArticle', article)
}

const filteredTree = computed(() => {
  if (!searchQuery.value.trim()) {
    return knowledgeTree
  }
  
  const query = searchQuery.value.toLowerCase()
  return knowledgeTree.map(category => {
    const filteredChildren = category.children?.filter(child => 
      child.name.toLowerCase().includes(query)
    )
    
    if (filteredChildren && filteredChildren.length > 0) {
      return { ...category, children: filteredChildren }
    }
    
    if (category.name.toLowerCase().includes(query)) {
      return category
    }
    
    return null
  }).filter(Boolean) as KnowledgeNode[]
})

const totalArticles = computed(() => {
  return knowledgeTree.reduce((sum, category) => {
    return sum + (category.children?.length || 0)
  }, 0)
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    expandedCategories.value = knowledgeTree.map(node => node.id)
  }
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  height: 100vh;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  padding: 20px 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.logo-icon {
  font-size: 24px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
}

.collapse-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s;
}

.collapse-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
  transform: scale(1.1);
}

.search-box {
  padding: 16px;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 10px 36px 10px 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 14px;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-icon {
  position: absolute;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  pointer-events: none;
}

.nav-tree {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.nav-section {
  margin-bottom: 4px;
}

.nav-category {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  user-select: none;
}

.nav-category:hover {
  background: var(--bg-hover);
}

.nav-category.active {
  background: var(--bg-tertiary);
}

.category-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.category-name {
  flex: 1;
  font-weight: 500;
  font-size: 14px;
  color: var(--text-primary);
}

.expand-icon {
  font-size: 10px;
  color: var(--text-muted);
  transition: transform 0.2s;
}

.nav-items {
  margin-left: 28px;
  margin-top: 4px;
  animation: slideInLeft 0.3s ease;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  font-size: 13px;
  color: var(--text-secondary);
}

.nav-item:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
  transform: translateX(2px);
}

.nav-item.active {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.15) 0%, transparent 100%);
  color: var(--accent-primary);
  border-left: 2px solid var(--accent-primary);
  padding-left: 10px;
}

.item-dot {
  font-size: 16px;
  opacity: 0.5;
}

.item-name {
  flex: 1;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-tertiary);
}

.footer-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-label {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 1000px;
}
</style>

