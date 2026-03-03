import type { PanoramaConfig } from '../types'

/**
 * 知识图谱数据统一导出
 * 根据分类ID获取对应的知识图谱配置
 */

import { javaConcurrentPanorama } from './javaConcurrent'
import { mysqlPanorama } from './mysql'
import { jvmPanorama } from './jvm'
import { springPanorama } from './spring'
import { distributedPanorama } from './distributed'
import { collectionsPanorama } from './collections'

// 知识图谱数据映射表
const panoramaMap: Record<string, PanoramaConfig> = {
  'java-concurrent': javaConcurrentPanorama,
  'mysql': mysqlPanorama,
  'jvm': jvmPanorama,
  'spring': springPanorama,
  'distributed': distributedPanorama,
  'collections': collectionsPanorama
}

/**
 * 根据分类ID获取知识图谱配置
 * @param categoryId 分类ID
 * @returns 知识图谱配置，如果不存在则返回 null
 */
export function getPanoramaConfig(categoryId: string): PanoramaConfig | null {
  return panoramaMap[categoryId] || null
}

/**
 * 获取所有支持知识图谱的分类ID列表
 */
export function getSupportedPanoramaCategories(): string[] {
  return Object.keys(panoramaMap)
}

/**
 * 检查某个分类是否支持知识图谱
 */
export function hasPanoramaSupport(categoryId: string): boolean {
  return categoryId in panoramaMap
}

