package com.kai.toolkit.domain.file.model;

import lombok.Builder;
import lombok.Getter;

import java.nio.file.Path;

@Getter
@Builder
public class DecodeRequest {

    private final Path filePath;

    /** URL 编码字符集，默认 UTF-8 */
    @Builder.Default
    private final String charset = "UTF-8";

    /** 是否格式化 JSON 输出 */
    @Builder.Default
    private final boolean prettyPrint = true;
}
