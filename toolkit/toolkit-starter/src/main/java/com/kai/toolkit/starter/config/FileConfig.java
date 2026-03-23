package com.kai.toolkit.starter.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.kai.toolkit.application.file.UrlDecodeService;
import com.kai.toolkit.domain.file.port.UrlDecodePort;
import com.kai.toolkit.infrastructure.file.NioUrlDecodeAdapter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 文件处理模块配置
 *
 * 组装文件解码相关的 Bean
 */
@Configuration
public class FileConfig {

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper().registerModule(new JavaTimeModule());
    }

    @Bean
    public UrlDecodePort urlDecodePort(ObjectMapper objectMapper) {
        return new NioUrlDecodeAdapter(objectMapper);
    }

    @Bean
    public UrlDecodeService urlDecodeService(UrlDecodePort urlDecodePort) {
        return new UrlDecodeService(urlDecodePort);
    }
}
