package com.kai.toolkit.application.http;

import com.kai.toolkit.domain.http.model.CrawlResult;
import com.kai.toolkit.domain.http.model.HttpRequest;
import com.kai.toolkit.domain.http.model.HttpResponse;
import com.kai.toolkit.domain.http.port.HttpClientPort;
import com.kai.toolkit.domain.shared.Result;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * 爬虫用例：发送请求 → 获取响应 → 解析内容
 * 依赖 HttpClientPort 接口，由 infrastructure 注入具体实现
 */
public class CrawlService {

    private final HttpClientPort httpClient;
    private final HtmlParserPort htmlParser;

    public CrawlService(HttpClientPort httpClient, HtmlParserPort htmlParser) {
        this.httpClient = httpClient;
        this.htmlParser = htmlParser;
    }

    public Result<CrawlResult> crawl(String url) {
        return crawl(url, Collections.emptyMap());
    }

    public Result<CrawlResult> crawl(String url, Map<String, String> extraHeaders) {
        HttpRequest request = HttpRequest.builder()
                .url(url)
                .headers(extraHeaders)
                .build();

        Result<HttpResponse> httpResult = httpClient.execute(request);
        if (!httpResult.isSuccess()) {
            return Result.fail(httpResult.getErrorMessage());
        }

        HttpResponse response = httpResult.getData();
        if (!response.isSuccessful()) {
            return Result.fail("HTTP " + response.getStatusCode() + " for " + url);
        }

        ParsedHtml parsed = htmlParser.parse(response.getBody(), url);

        CrawlResult result = CrawlResult.builder()
                .url(url)
                .statusCode(response.getStatusCode())
                .rawHtml(response.getBody())
                .title(parsed.getTitle())
                .text(parsed.getText())
                .links(parsed.getLinks())
                .extractedData(Collections.emptyMap())
                .crawledAt(Instant.now())
                .build();

        return Result.ok(result);
    }
}
