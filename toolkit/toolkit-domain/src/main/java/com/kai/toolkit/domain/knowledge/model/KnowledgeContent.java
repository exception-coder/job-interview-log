package com.kai.toolkit.domain.knowledge.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 知识点内容
 *
 * 表示单个 Markdown 文件的内容
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KnowledgeContent {

    /**
     * 文件相对路径
     */
    private String path;

    /**
     * Markdown 原始内容
     */
    private String content;
}
