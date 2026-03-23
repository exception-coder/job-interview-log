package com.kai.toolkit.infrastructure.http;

import com.kai.toolkit.domain.http.model.HttpRequest;
import com.kai.toolkit.domain.http.model.HttpResponse;
import com.kai.toolkit.domain.http.port.HttpClientPort;
import com.kai.toolkit.domain.shared.Result;
import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

public class OkHttpClientAdapter implements HttpClientPort {

    private static final Logger log = LoggerFactory.getLogger(OkHttpClientAdapter.class);
    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    private final OkHttpClient client;

    public OkHttpClientAdapter(int connectTimeoutSeconds, int readTimeoutSeconds) {
        this.client = new OkHttpClient.Builder()
                .connectTimeout(connectTimeoutSeconds, TimeUnit.SECONDS)
                .readTimeout(readTimeoutSeconds, TimeUnit.SECONDS)
                .followRedirects(true)
                .build();
    }

    @Override
    public Result<HttpResponse> execute(HttpRequest request) {
        try {
            Request okRequest = buildRequest(request);
            try (Response response = client.newCall(okRequest).execute()) {
                String body = response.body() != null ? response.body().string() : "";
                Map<String, String> headers = extractHeaders(response.headers());
                HttpResponse httpResponse = HttpResponse.builder()
                        .statusCode(response.code())
                        .body(body)
                        .headers(headers)
                        .build();
                return Result.ok(httpResponse);
            }
        } catch (IOException e) {
            log.error("HTTP request failed: {}", request.getUrl(), e);
            return Result.fail(e.getMessage());
        }
    }

    private Request buildRequest(HttpRequest request) {
        Request.Builder builder = new Request.Builder().url(request.getUrl());
        request.getHeaders().forEach(builder::header);

        if ("POST".equalsIgnoreCase(request.getMethod()) && request.getBody() != null) {
            builder.post(RequestBody.create(request.getBody(), JSON));
        } else if ("GET".equalsIgnoreCase(request.getMethod())) {
            builder.get();
        } else {
            builder.method(request.getMethod(),
                    request.getBody() != null ? RequestBody.create(request.getBody(), JSON) : null);
        }
        return builder.build();
    }

    private Map<String, String> extractHeaders(Headers headers) {
        Map<String, String> map = new HashMap<>();
        for (String name : headers.names()) {
            map.put(name, headers.get(name));
        }
        return map;
    }
}
