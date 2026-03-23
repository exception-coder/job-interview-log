package com.kai.toolkit.domain.http.port;

import com.kai.toolkit.domain.http.model.HttpRequest;
import com.kai.toolkit.domain.http.model.HttpResponse;
import com.kai.toolkit.domain.shared.Result;

/**
 * HTTP 出站端口（六边形架构 Driven Port）
 * domain 只依赖此接口，具体实现在 infrastructure 层
 */
public interface HttpClientPort {

    Result<HttpResponse> execute(HttpRequest request);
}
