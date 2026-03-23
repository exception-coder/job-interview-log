package com.kai.toolkit.application.http;

import java.util.List;

/**
 * HTML 解析出站端口
 */
public interface HtmlParserPort {

    ParsedHtml parse(String html, String baseUrl);
}
