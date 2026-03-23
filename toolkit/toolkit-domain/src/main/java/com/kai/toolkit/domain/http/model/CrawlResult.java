package com.kai.toolkit.domain.http.model;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.List;
import java.util.Map;

/**
 * 爬取结果：包含原始响应 + 解析后的结构化数据
 */
@Getter
@Builder
public class CrawlResult {

    private final String url;
    private final int statusCode;
    private final String rawHtml;
    private final String title;
    private final String text;
    /** 页面中所有链接 */
    private final List<String> links;
    /** 自定义提取的键值对 */
    private final Map<String, String> extractedData;
    private final Instant crawledAt;
}
