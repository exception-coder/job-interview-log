package com.kai.toolkit.infrastructure.knowledge;

import com.kai.toolkit.domain.knowledge.model.KnowledgeContent;
import com.kai.toolkit.domain.knowledge.model.KnowledgeNode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * FileSystemKnowledgeRepository 单元测试
 */
class FileSystemKnowledgeRepositoryTest {

    @TempDir
    Path tempDir;

    private FileSystemKnowledgeRepository repository;

    @BeforeEach
    void setUp() throws IOException {
        // 创建测试目录结构
        // tempDir/
        //   ├── Java基础/
        //   │   ├── 基本类型.md
        //   │   └── IO/
        //   │       └── 什么是序列化.md
        //   └── MySQL/
        //       └── 索引.md

        Path javaDir = tempDir.resolve("Java基础");
        Files.createDirectories(javaDir);
        Files.writeString(javaDir.resolve("基本类型.md"), "# 基本类型\n\nJava 有 8 种基本类型");

        Path ioDir = javaDir.resolve("IO");
        Files.createDirectories(ioDir);
        Files.writeString(ioDir.resolve("什么是序列化.md"), "# 什么是序列化\n\n序列化是...");

        Path mysqlDir = tempDir.resolve("MySQL");
        Files.createDirectories(mysqlDir);
        Files.writeString(mysqlDir.resolve("索引.md"), "# 索引\n\nMySQL 索引...");

        repository = new FileSystemKnowledgeRepository(tempDir.toString());
    }

    @Test
    void testGetKnowledgeTree() {
        // 获取目录树
        KnowledgeNode tree = repository.getKnowledgeTree();

        // 验证根节点
        assertNotNull(tree);
        assertEquals(KnowledgeNode.NodeType.DIRECTORY, tree.getType());
        assertEquals(2, tree.getChildren().size());

        // 验证 Java基础 目录
        KnowledgeNode javaNode = tree.getChildren().stream()
            .filter(n -> n.getName().equals("Java基础"))
            .findFirst()
            .orElseThrow();

        assertEquals(KnowledgeNode.NodeType.DIRECTORY, javaNode.getType());
        assertEquals(2, javaNode.getChildren().size());

        // 验证 基本类型.md 文件
        KnowledgeNode fileNode = javaNode.getChildren().stream()
            .filter(n -> n.getName().equals("基本类型.md"))
            .findFirst()
            .orElseThrow();

        assertEquals(KnowledgeNode.NodeType.FILE, fileNode.getType());
        assertNull(fileNode.getChildren());
    }

    @Test
    void testGetContentByPath_Success() {
        // 获取文件内容
        Optional<KnowledgeContent> content = repository.getContentByPath("Java基础/基本类型.md");

        // 验证
        assertTrue(content.isPresent());
        assertEquals("Java基础/基本类型.md", content.get().getPath());
        assertTrue(content.get().getContent().contains("Java 有 8 种基本类型"));
    }

    @Test
    void testGetContentByPath_NestedFile() {
        // 获取嵌套目录中的文件
        Optional<KnowledgeContent> content = repository.getContentByPath("Java基础/IO/什么是序列化.md");

        // 验证
        assertTrue(content.isPresent());
        assertTrue(content.get().getContent().contains("序列化是"));
    }

    @Test
    void testGetContentByPath_NotFound() {
        // 获取不存在的文件
        Optional<KnowledgeContent> content = repository.getContentByPath("不存在的文件.md");

        // 验证
        assertFalse(content.isPresent());
    }

    @Test
    void testGetContentByPath_NotMarkdown() {
        // 获取非 Markdown 文件
        Optional<KnowledgeContent> content = repository.getContentByPath("Java基础/基本类型.txt");

        // 验证
        assertFalse(content.isPresent());
    }
}
