package com.kai.toolkit.starter.config;

import com.kai.toolkit.application.knowledge.KnowledgeQueryService;
import com.kai.toolkit.domain.knowledge.port.KnowledgeRepositoryPort;
import com.kai.toolkit.infrastructure.knowledge.FileSystemKnowledgeRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 知识点模块配置
 *
 * 组装知识点查询相关的 Bean
 */
@Configuration
public class KnowledgeConfig {

    @Bean
    public KnowledgeRepositoryPort knowledgeRepositoryPort(
        @Value("${toolkit.knowledge.root-path}") String knowledgeRootPath
    ) {
        return new FileSystemKnowledgeRepository(knowledgeRootPath);
    }

    @Bean
    public KnowledgeQueryService knowledgeQueryService(
        KnowledgeRepositoryPort knowledgeRepositoryPort
    ) {
        return new KnowledgeQueryService(knowledgeRepositoryPort);
    }
}
