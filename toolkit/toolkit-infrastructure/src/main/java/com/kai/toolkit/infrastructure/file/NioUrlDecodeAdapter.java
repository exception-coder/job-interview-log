package com.kai.toolkit.infrastructure.file;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kai.toolkit.domain.file.model.DecodeRequest;
import com.kai.toolkit.domain.file.model.DecodeResult;
import com.kai.toolkit.domain.file.port.UrlDecodePort;
import com.kai.toolkit.domain.shared.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

/**
 * 标准 URL 解码适配器，适用于中小文件（百 MB 以内）。
 * <p>
 * 使用 {@link Files#readString} 一次性读取文件内容，再整体 URL 解码。
 * 实现简单，解码后可选 JSON 格式化输出。
 * 若文件过大导致内存压力，请改用 {@link StreamingUrlDecodeAdapter}。
 * <p>
 * 属于 infrastructure 层，实现 {@link UrlDecodePort} 接口。
 */
public class NioUrlDecodeAdapter implements UrlDecodePort {

    private static final Logger log = LoggerFactory.getLogger(NioUrlDecodeAdapter.class);

    private final ObjectMapper objectMapper;

    /**
     * @param objectMapper 用于 JSON 格式化，需注册 JavaTimeModule
     */
    public NioUrlDecodeAdapter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * 读取文件并进行 URL 解码，可选 JSON 格式化。
     *
     * @param request 解码请求，包含文件路径、字符集、是否格式化
     * @return 解码成功返回 Result.ok(DecodeResult)，IO 异常返回 Result.fail
     */
    @Override
    public Result<DecodeResult> decode(DecodeRequest request) {
        try {
            Charset charset = Charset.forName(request.getCharset());

            // 一次性读取文件原始内容
            String raw = Files.readString(request.getFilePath(), StandardCharsets.UTF_8);
            long originalBytes = raw.length();

            // URL 解码
            String decoded = URLDecoder.decode(raw, charset);
            long decodedChars = decoded.length();

            // 按需格式化 JSON（非 JSON 内容原样返回）
            if (request.isPrettyPrint()) {
                decoded = prettyPrintIfJson(decoded);
            }

            return Result.ok(DecodeResult.builder()
                    .decoded(decoded)
                    .originalBytes(originalBytes)
                    .decodedChars(decodedChars)
                    .build());

        } catch (IOException e) {
            log.error("Failed to decode file: {}", request.getFilePath(), e);
            return Result.fail(e.getMessage());
        }
    }

    /**
     * 尝试将字符串格式化为 JSON，失败则原样返回。
     *
     * @param content 待格式化的字符串
     * @return 格式化后的 JSON 字符串，或原始字符串
     */
    private String prettyPrintIfJson(String content) {
        try {
            Object node = objectMapper.readValue(content, Object.class);
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(node);
        } catch (Exception e) {
            // 不是合法 JSON，原样返回
            return content;
        }
    }
}
