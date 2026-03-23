package com.kai.toolkit.domain.knowledge.port;

import com.kai.toolkit.domain.knowledge.model.KnowledgeContent;
import com.kai.toolkit.domain.knowledge.model.KnowledgeNode;

import java.util.Optional;

/**
 * 知识点仓储端口
 *
 * 定义知识点数据的访问接口
 */
public interface KnowledgeRepositoryPort {

    /**
     * 获取知识点目录树
     *
     * @return 根节点，包含完整的目录树结构
     */
    KnowledgeNode getKnowledgeTree();

    /**
     * 根据相对路径获取知识点内容
     *
     * @param relativePath 相对于知识根目录的路径
     * @return 知识点内容，如果文件不存在返回 empty
     */
    Optional<KnowledgeContent> getContentByPath(String relativePath);
}
