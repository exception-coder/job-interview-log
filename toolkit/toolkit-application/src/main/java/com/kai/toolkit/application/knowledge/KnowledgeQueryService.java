package com.kai.toolkit.application.knowledge;

import com.kai.toolkit.domain.knowledge.model.KnowledgeContent;
import com.kai.toolkit.domain.knowledge.model.KnowledgeNode;
import com.kai.toolkit.domain.knowledge.port.KnowledgeRepositoryPort;
import lombok.RequiredArgsConstructor;

import java.util.Optional;

/**
 * 知识点查询服务
 *
 * 提供知识点目录树和内容查询功能
 */
@RequiredArgsConstructor
public class KnowledgeQueryService {

    private final KnowledgeRepositoryPort knowledgeRepository;

    /**
     * 获取完整的知识点目录树
     *
     * @return 知识点目录树根节点
     */
    public KnowledgeNode getKnowledgeTree() {
        return knowledgeRepository.getKnowledgeTree();
    }

    /**
     * 根据相对路径获取知识点内容
     *
     * @param relativePath 相对于知识根目录的路径，如 "Java基础/IO_and_序列化/什么是序列化Q.md"
     * @return 知识点内容，如果文件不存在返回 empty
     */
    public Optional<KnowledgeContent> getContentByPath(String relativePath) {
        // 参数校验
        if (relativePath == null || relativePath.isBlank()) {
            return Optional.empty();
        }

        // 路径规范化：移除前导斜杠
        String normalizedPath = relativePath.startsWith("/")
            ? relativePath.substring(1)
            : relativePath;

        return knowledgeRepository.getContentByPath(normalizedPath);
    }
}
