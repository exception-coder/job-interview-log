package com.kai.toolkit.domain.file.model;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DecodeResult {

    private final String decoded;
    /** 原始字节数 */
    private final long originalBytes;
    /** 解码后字符数 */
    private final long decodedChars;
}
