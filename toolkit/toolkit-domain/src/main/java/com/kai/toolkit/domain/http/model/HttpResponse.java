package com.kai.toolkit.domain.http.model;

import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Getter
@Builder
public class HttpResponse {

    private final int statusCode;
    private final String body;
    private final Map<String, String> headers;

    public boolean isSuccessful() {
        return statusCode >= 200 && statusCode < 300;
    }
}
