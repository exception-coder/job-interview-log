package com.kai.toolkit.domain.http.model;

import lombok.Builder;
import lombok.Getter;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Getter
@Builder
public class HttpRequest {

    private final String url;

    @Builder.Default
    private final String method = "GET";

    @Builder.Default
    private final Map<String, String> headers = new HashMap<>();

    /** 请求体（POST/PUT 时使用），可为 null */
    private final String body;

    /** 超时秒数，0 表示使用客户端默认值 */
    @Builder.Default
    private final int timeoutSeconds = 0;

    public Map<String, String> getHeaders() {
        return Collections.unmodifiableMap(headers);
    }
}
