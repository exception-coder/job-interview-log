package com.kai.toolkit.infrastructure.knowledge;

import com.kai.toolkit.domain.knowledge.model.KnowledgeContent;
import com.kai.toolkit.domain.knowledge.model.KnowledgeNode;
import com.kai.toolkit.domain.knowledge.port.KnowledgeRepositoryPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

/**
 * 文件系统知识点仓储适配器
 *
 * 从本地文件系统读取知识点目录和内容
 */
@Slf4j
@RequiredArgsConstructor
public class FileSystemKnowledgeRepository implements KnowledgeRepositoryPort {

    private final String knowledgeRootPath;

    @Override
    public KnowledgeNode getKnowledgeTree() {
        Path rootPath = Paths.get(knowledgeRootPath);

        // 校验根目录是否存在
        if (!Files.exists(rootPath) || !Files.isDirectory(rootPath)) {
            log.error("知识根目录不存在或不是目录: {}", knowledgeRootPath);
            return KnowledgeNode.builder()
                .name("root")
                .path("")
                .type(KnowledgeNode.NodeType.DIRECTORY)
                .children(List.of())
                .build();
        }

        // 递归构建目录树
        return buildNode(rootPath, rootPath);
    }

    @Override
    public Optional<KnowledgeContent> getContentByPath(String relativePath) {
        Path fullPath = Paths.get(knowledgeRootPath, relativePath);

        // 校验文件是否存在且为 Markdown 文件
        if (!Files.exists(fullPath) || !Files.isRegularFile(fullPath)) {
            log.warn("文件不存在或不是常规文件: {}", fullPath);
            return Optional.empty();
        }

        if (!relativePath.endsWith(".md")) {
            log.warn("不是 Markdown 文件: {}", relativePath);
            return Optional.empty();
        }

        // 读取文件内容
        try {
            String content = Files.readString(fullPath);
            return Optional.of(KnowledgeContent.builder()
                .path(relativePath)
                .content(content)
                .build());
        } catch (IOException e) {
            log.error("读取文件失败: {}", fullPath, e);
            return Optional.empty();
        }
    }

    /**
     * 递归构建目录节点
     *
     * @param currentPath 当前路径
     * @param rootPath 根路径（用于计算相对路径）
     * @return 目录节点
     */
    private KnowledgeNode buildNode(Path currentPath, Path rootPath) {
        String name = currentPath.getFileName() != null
            ? currentPath.getFileName().toString()
            : "root";

        String relativePath = rootPath.relativize(currentPath).toString();

        // 如果是文件
        if (Files.isRegularFile(currentPath)) {
            // 只处理 Markdown 文件
            if (name.endsWith(".md")) {
                return KnowledgeNode.builder()
                    .name(name)
                    .path(relativePath)
                    .type(KnowledgeNode.NodeType.FILE)
                    .children(null)
                    .build();
            }
            return null; // 忽略非 Markdown 文件
        }

        // 如果是目录，递归处理子节点
        List<KnowledgeNode> children = new ArrayList<>();
        try (Stream<Path> paths = Files.list(currentPath)) {
            paths.sorted(Comparator.comparing(Path::toString))
                .forEach(path -> {
                    KnowledgeNode childNode = buildNode(path, rootPath);
                    if (childNode != null) {
                        children.add(childNode);
                    }
                });
        } catch (IOException e) {
            log.error("读取目录失败: {}", currentPath, e);
        }

        return KnowledgeNode.builder()
            .name(name)
            .path(relativePath)
            .type(KnowledgeNode.NodeType.DIRECTORY)
            .children(children)
            .build();
    }
}
