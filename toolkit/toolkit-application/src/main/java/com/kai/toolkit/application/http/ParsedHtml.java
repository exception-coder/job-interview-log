package com.kai.toolkit.application.http;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ParsedHtml {
    private final String title;
    private final String text;
    private final List<String> links;
}
