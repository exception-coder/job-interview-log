package com.kai.toolkit.infrastructure.http;

import com.kai.toolkit.application.http.HtmlParserPort;
import com.kai.toolkit.application.http.ParsedHtml;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import java.util.List;

public class JsoupHtmlParser implements HtmlParserPort {

    @Override
    public ParsedHtml parse(String html, String baseUrl) {
        Document doc = Jsoup.parse(html, baseUrl);

        String title = doc.title();
        String text = doc.body() != null ? doc.body().text() : "";
        List<String> links = doc.select("a[href]")
                .stream()
                .map(el -> el.absUrl("href"))
                .filter(href -> !href.isBlank())
                .distinct()
                .toList();

        return ParsedHtml.builder()
                .title(title)
                .text(text)
                .links(links)
                .build();
    }
}
