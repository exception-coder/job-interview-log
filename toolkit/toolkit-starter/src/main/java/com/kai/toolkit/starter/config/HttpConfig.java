package com.kai.toolkit.starter.config;

import com.kai.toolkit.application.http.CrawlService;
import com.kai.toolkit.application.http.HtmlParserPort;
import com.kai.toolkit.domain.http.port.HttpClientPort;
import com.kai.toolkit.infrastructure.http.JsoupHtmlParser;
import com.kai.toolkit.infrastructure.http.OkHttpClientAdapter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * HTTP 模块配置
 *
 * 组装 HTTP 客户端和爬虫相关的 Bean
 */
@Configuration
public class HttpConfig {

    @Value("${toolkit.http.connect-timeout:10}")
    private int connectTimeout;

    @Value("${toolkit.http.read-timeout:30}")
    private int readTimeout;

    @Bean
    public HttpClientPort httpClientPort() {
        return new OkHttpClientAdapter(connectTimeout, readTimeout);
    }

    @Bean
    public HtmlParserPort htmlParserPort() {
        return new JsoupHtmlParser();
    }

    @Bean
    public CrawlService crawlService(HttpClientPort httpClientPort, HtmlParserPort htmlParserPort) {
        return new CrawlService(httpClientPort, htmlParserPort);
    }
}
