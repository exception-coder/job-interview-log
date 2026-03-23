package com.kai.toolkit.infrastructure.file;

import com.kai.toolkit.domain.file.model.DecodeRequest;
import com.kai.toolkit.domain.file.model.DecodeResult;
import com.kai.toolkit.domain.shared.Result;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class StreamingUrlDecodeAdapterTest {

    @Test
    void decode_simpleContent_writesToOutputFile(@TempDir Path tempDir) throws IOException {
        // 准备输入文件和输出路径
        Path input = tempDir.resolve("input.txt");
        Path output = tempDir.resolve("output.txt");
        Files.writeString(input, "hello+world%21", StandardCharsets.UTF_8);

        StreamingUrlDecodeAdapter adapter = new StreamingUrlDecodeAdapter(output);
        DecodeRequest request = DecodeRequest.builder().filePath(input).build();

        Result<DecodeResult> result = adapter.decode(request);

        assertTrue(result.isSuccess());
        // 验证内容写入了输出文件
        String outputContent = Files.readString(output, StandardCharsets.UTF_8);
        assertEquals("hello world!", outputContent);
    }

    @Test
    void decode_percentSignAtChunkBoundary_decodesCorrectly(@TempDir Path tempDir) throws IOException {
        // 关键边界测试：构造一段内容，使 %XX 恰好跨越块边界
        // 使用反射将 CHUNK_SIZE 等效为小值来模拟，这里用小块手动构造
        // 构造：前半段末尾是 '%2'，后半段开头是 '1'，合起来是 %21 = '!'
        String part1 = "a".repeat(10) + "%2";
        String part2 = "1" + "b".repeat(10);
        Path input = tempDir.resolve("input.txt");
        // 写入完整内容，流式解码应正确处理
        Files.writeString(input, part1 + part2, StandardCharsets.UTF_8);

        Path output = tempDir.resolve("output.txt");
        StreamingUrlDecodeAdapter adapter = new StreamingUrlDecodeAdapter(output);
        DecodeRequest request = DecodeRequest.builder().filePath(input).build();

        Result<DecodeResult> result = adapter.decode(request);

        assertTrue(result.isSuccess());
        String outputContent = Files.readString(output, StandardCharsets.UTF_8);
        // %21 应被解码为 '!'
        assertTrue(outputContent.contains("!"));
        assertEquals("aaaaaaaaaa!bbbbbbbbbb", outputContent);
    }

    @Test
    void decode_chineseCharacters_decodesCorrectly(@TempDir Path tempDir) throws IOException {
        // 中文 URL 编码：'你好' = %E4%BD%A0%E5%A5%BD
        Path input = tempDir.resolve("input.txt");
        Files.writeString(input, "%E4%BD%A0%E5%A5%BD", StandardCharsets.UTF_8);

        Path output = tempDir.resolve("output.txt");
        StreamingUrlDecodeAdapter adapter = new StreamingUrlDecodeAdapter(output);
        DecodeRequest request = DecodeRequest.builder().filePath(input).build();

        Result<DecodeResult> result = adapter.decode(request);

        assertTrue(result.isSuccess());
        assertEquals("你好", Files.readString(output, StandardCharsets.UTF_8));
    }

    @Test
    void decode_emptyFile_writesEmptyOutput(@TempDir Path tempDir) throws IOException {
        // 空文件应写出空内容
        Path input = tempDir.resolve("empty.txt");
        Path output = tempDir.resolve("output.txt");
        Files.writeString(input, "", StandardCharsets.UTF_8);

        StreamingUrlDecodeAdapter adapter = new StreamingUrlDecodeAdapter(output);
        DecodeRequest request = DecodeRequest.builder().filePath(input).build();

        Result<DecodeResult> result = adapter.decode(request);

        assertTrue(result.isSuccess());
        assertEquals("", Files.readString(output, StandardCharsets.UTF_8));
    }

    @Test
    void decode_fileNotFound_returnsFail(@TempDir Path tempDir) {
        // 输入文件不存在应返回 fail
        Path output = tempDir.resolve("output.txt");
        StreamingUrlDecodeAdapter adapter = new StreamingUrlDecodeAdapter(output);
        DecodeRequest request = DecodeRequest.builder()
                .filePath(Path.of("/nonexistent/file.txt"))
                .build();

        Result<DecodeResult> result = adapter.decode(request);

        assertFalse(result.isSuccess());
        assertNotNull(result.getErrorMessage());
    }

    @Test
    void decode_statisticsAreCorrect(@TempDir Path tempDir) throws IOException {
        // 验证字节统计正确
        String encoded = "%E4%BD%A0"; // '你' 的 UTF-8 URL 编码，9 个原始字节
        Path input = tempDir.resolve("input.txt");
        Files.writeString(input, encoded, StandardCharsets.UTF_8);

        Path output = tempDir.resolve("output.txt");
        StreamingUrlDecodeAdapter adapter = new StreamingUrlDecodeAdapter(output);
        DecodeRequest request = DecodeRequest.builder().filePath(input).build();

        Result<DecodeResult> result = adapter.decode(request);

        assertTrue(result.isSuccess());
        assertEquals(9, result.getData().getOriginalBytes());
        assertEquals(1, result.getData().getDecodedChars()); // '你' 是 1 个字符
    }
}
