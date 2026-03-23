package com.kai.toolkit.domain.knowledge.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 知识点目录节点
 *
 * 表示知识点的层级结构，可以是目录或文件
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KnowledgeNode {

    /**
     * 节点名称（目录名或文件名）
     */
    private String name;

    /**
     * 相对路径（相对于知识根目录）
     */
    private String path;

    /**
     * 节点类型
     */
    private NodeType type;

    /**
     * 子节点（仅目录类型有效）
     */
    private List<KnowledgeNode> children;

    /**
     * 节点类型枚举
     */
    public enum NodeType {
        /** 目录 */
        DIRECTORY,
        /** Markdown 文件 */
        FILE
    }
}
