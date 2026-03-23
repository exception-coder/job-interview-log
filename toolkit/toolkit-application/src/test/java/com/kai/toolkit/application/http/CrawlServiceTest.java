package com.kai.toolkit.application.http;

import com.kai.toolkit.domain.http.model.CrawlResult;
import com.kai.toolkit.domain.http.model.HttpResponse;
import com.kai.toolkit.domain.http.port.HttpClientPort;
import com.kai.toolkit.domain.shared.Result;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CrawlServiceTest {

    @Mock
    private HttpClientPort httpClient;

    @Mock
    private HtmlParserPort htmlParser;

    private CrawlService crawlService;

    @BeforeEach
    void setUp() {
        crawlService = new CrawlService(httpClient, htmlParser);
    }

    @Test
    void crawl_success() {
        HttpResponse response = HttpResponse.builder()
                .statusCode(200)
                .body("<html><head><title>Test</title></head><body>Hello</body></html>")
                .headers(Map.of())
                .build();
        when(httpClient.execute(any())).thenReturn(Result.ok(response));

        ParsedHtml parsed = ParsedHtml.builder()
                .title("Test")
                .text("Hello")
                .links(List.of())
                .build();
        when(htmlParser.parse(any(), any())).thenReturn(parsed);

        Result<CrawlResult> result = crawlService.crawl("https://example.com");

        assertTrue(result.isSuccess());
        assertEquals("Test", result.getData().getTitle());
        assertEquals("Hello", result.getData().getText());
    }

    @Test
    void crawl_httpError_returnsFail() {
        when(httpClient.execute(any())).thenReturn(Result.fail("connection refused"));

        Result<CrawlResult> result = crawlService.crawl("https://example.com");

        assertFalse(result.isSuccess());
        assertEquals("connection refused", result.getErrorMessage());
    }

    @Test
    void crawl_non2xx_returnsFail() {
        HttpResponse response = HttpResponse.builder()
                .statusCode(404)
                .body("Not Found")
                .headers(Map.of())
                .build();
        when(httpClient.execute(any())).thenReturn(Result.ok(response));

        Result<CrawlResult> result = crawlService.crawl("https://example.com");

        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessage().contains("404"));
    }
}
