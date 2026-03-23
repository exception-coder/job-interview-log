package com.kai.toolkit.api.controller;

import com.kai.toolkit.application.knowledge.KnowledgeQueryService;
import com.kai.toolkit.domain.knowledge.model.KnowledgeContent;
import com.kai.toolkit.domain.knowledge.model.KnowledgeNode;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 知识点查询 REST API
 *
 * 提供知识点目录树和内容查询接口
 */
@RestController
@RequestMapping("/api/knowledge")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class KnowledgeController {

    private final KnowledgeQueryService knowledgeQueryService;

    /**
     * 获取知识点目录树
     *
     * @return 完整的知识点目录树
     */
    @GetMapping("/tree")
    public ResponseEntity<KnowledgeNode> getKnowledgeTree() {
        KnowledgeNode tree = knowledgeQueryService.getKnowledgeTree();
        return ResponseEntity.ok(tree);
    }

    /**
     * 根据相对路径获取知识点内容
     *
     * @param path 相对路径，如 "Java基础/IO_and_序列化/什么是序列化Q.md"
     * @return 知识点内容
     */
    @GetMapping("/content")
    public ResponseEntity<KnowledgeContent> getContentByPath(
        @RequestParam("path") String path
    ) {
        return knowledgeQueryService.getContentByPath(path)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
