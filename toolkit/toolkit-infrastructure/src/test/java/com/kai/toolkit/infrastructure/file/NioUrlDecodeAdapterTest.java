package com.kai.toolkit.infrastructure.file;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.kai.toolkit.domain.file.model.DecodeRequest;
import com.kai.toolkit.domain.file.model.DecodeResult;
import com.kai.toolkit.domain.shared.Result;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class NioUrlDecodeAdapterTest {

    private NioUrlDecodeAdapter adapter;

    @BeforeEach
    void setUp() {
        ObjectMapper mapper = new ObjectMapper().registerModule(new JavaTimeModule());
        adapter = new NioUrlDecodeAdapter(mapper);
    }

    @Test
    void decode_simpleUrlEncoded_returnsDecodedString(@TempDir Path tempDir) throws IOException {
        // 准备：写入简单 URL 编码内容
        Path input = tempDir.resolve("input.txt");
        Files.writeString(input, "hello+world%21", StandardCharsets.UTF_8);

        DecodeRequest request = DecodeRequest.builder()
                .filePath(input)
                .prettyPrint(false)
                .build();

        Result<DecodeResult> result = adapter.decode(request);

        assertTrue(result.isSuccess());
        assertEquals("hello world!", result.getData().getDecoded());
    }

    @Test
    void decode_jsonContent_returnsPrettyPrinted(@TempDir Path tempDir) throws IOException {
        // 准备：URL 编码的 JSON 字符串
        Path input = tempDir.resolve("input.txt");
        Files.writeString(input, "%7B%22key%22%3A%22value%22%7D", StandardCharsets.UTF_8);

        DecodeRequest request = DecodeRequest.builder()
                .filePath(input)
                .prettyPrint(true)
                .build();

        Result<DecodeResult> result = adapter.decode(request);

        assertTrue(result.isSuccess());
        // 格式化后应包含换行
        assertTrue(result.getData().getDecoded().contains("\n"));
        assertTrue(result.getData().getDecoded().contains("\"key\""));
    }

    @Test
    void decode_nonJsonContent_prettyPrintReturnOriginal(@TempDir Path tempDir) throws IOException {
        // 非 JSON 内容，prettyPrint 应原样返回
        Path input = tempDir.resolve("input.txt");
        Files.writeString(input, "hello+world", StandardCharsets.UTF_8);

        DecodeRequest request = DecodeRequest.builder()
                .filePath(input)
                .prettyPrint(true)
                .build();

        Result<DecodeResult> result = adapter.decode(request);

        assertTrue(result.isSuccess());
        assertEquals("hello world", result.getData().getDecoded());
    }

    @Test
    void decode_fileNotFound_returnsFail() {
        // 文件不存在应返回 fail
        DecodeRequest request = DecodeRequest.builder()
                .filePath(Path.of("/nonexistent/file.txt"))
                .build();

        Result<DecodeResult> result = adapter.decode(request);

        assertFalse(result.isSuccess());
        assertNotNull(result.getErrorMessage());
    }

    @Test
    void decode_emptyFile_returnsEmptyString(@TempDir Path tempDir) throws IOException {
        // 空文件应返回空字符串
        Path input = tempDir.resolve("empty.txt");
        Files.writeString(input, "", StandardCharsets.UTF_8);

        DecodeRequest request = DecodeRequest.builder()
                .filePath(input)
                .prettyPrint(false)
                .build();

        Result<DecodeResult> result = adapter.decode(request);

        assertTrue(result.isSuccess());
        assertEquals("", result.getData().getDecoded());
    }

    @Test
    void decode_statisticsAreCorrect(@TempDir Path tempDir) throws IOException {
        // 验证 originalBytes 和 decodedChars 统计正确
        String encoded = "hello%20world";
        Path input = tempDir.resolve("input.txt");
        Files.writeString(input, encoded, StandardCharsets.UTF_8);

        DecodeRequest request = DecodeRequest.builder()
                .filePath(input)
                .prettyPrint(false)
                .build();

        Result<DecodeResult> result = adapter.decode(request);

        assertTrue(result.isSuccess());
        assertEquals(encoded.length(), result.getData().getOriginalBytes());
        assertEquals("hello world".length(), result.getData().getDecodedChars());
    }
}
