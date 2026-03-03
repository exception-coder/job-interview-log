/**
 * 代码高亮业务逻辑
 */
export function useHighlight() {
  /**
   * 高亮代码
   * @param code 原始代码
   * @returns 高亮后的HTML
   */
  function highlightCode(code: string): string {
    if (!code) return ''
    
    // 先转义HTML特殊字符
    let highlighted = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    
    // 使用占位符策略，避免重复替换
    const placeholders: { [key: string]: string } = {}
    let placeholderIndex = 0
    
    // 1. 先处理注释，用占位符替换
    highlighted = highlighted.replace(/\/\/(.*?)$/gm, (match) => {
      const placeholder = `__COMMENT_${placeholderIndex++}__`
      placeholders[placeholder] = `<span class="comment">${match}</span>`
      return placeholder
    })
    
    highlighted = highlighted.replace(/\/\*([\s\S]*?)\*\//g, (match) => {
      const placeholder = `__COMMENT_${placeholderIndex++}__`
      placeholders[placeholder] = `<span class="comment">${match}</span>`
      return placeholder
    })
    
    // 2. 处理字符串，用占位符替换
    highlighted = highlighted.replace(/"([^"]*)"/g, (match) => {
      const placeholder = `__STRING_${placeholderIndex++}__`
      placeholders[placeholder] = `<span class="string">${match}</span>`
      return placeholder
    })
    
    // 3. 高亮关键字
    const keywords = [
      'public', 'private', 'protected', 'static', 'final', 'class', 'interface',
      'extends', 'implements', 'void', 'int', 'long', 'double', 'float', 'boolean',
      'String', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case',
      'break', 'continue', 'new', 'this', 'super', 'try', 'catch', 'finally',
      'throw', 'throws', 'import', 'package', 'synchronized', 'volatile',
      'transient', 'native', 'abstract', 'default', 'enum', 'assert',
      'Thread', 'System', 'ExecutorService', 'Executors', 'out', 'println'
    ]
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g')
      highlighted = highlighted.replace(regex, `<span class="keyword">${keyword}</span>`)
    })
    
    // 4. 高亮数字
    highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
    
    // 5. 还原占位符
    Object.keys(placeholders).forEach(placeholder => {
      highlighted = highlighted.replace(placeholder, placeholders[placeholder])
    })
    
    return highlighted
  }

  return {
    highlightCode
  }
}

