package com.kai.toolkit.infrastructure.file;

import com.kai.toolkit.domain.file.model.DecodeRequest;
import com.kai.toolkit.domain.file.model.DecodeResult;
import com.kai.toolkit.domain.file.port.UrlDecodePort;
import com.kai.toolkit.domain.shared.Result;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * 流式 URL 解码适配器，适用于超大文件（数百 MB 以上）。
 * <p>
 * 核心思路：逐块读取原始字节，解决 {@code %XX} 跨块边界问题后立即解码，
 * 解码结果直接流式写入输出文件，全程堆内仅保留一个块的数据，不拼接完整内容。
 * <p>
 * 限制：
 * <ul>
 *   <li>输出必须写入文件，不支持返回完整字符串（内存放不下）</li>
 *   <li>不支持 prettyPrint（JSON 格式化需要完整内容）</li>
 * </ul>
 * 属于 infrastructure 层，实现 {@link UrlDecodePort} 接口。
 */
public class StreamingUrlDecodeAdapter implements UrlDecodePort {

    private static final Logger log = LoggerFactory.getLogger(StreamingUrlDecodeAdapter.class);

    /** 每次读取的块大小，需为 3 的倍数以方便对齐 %XX 边界 */
    private static final int CHUNK_SIZE = 256 * 1024;

    /** 流式解码的输出文件路径，必须在构造时指定 */
    private final Path outputPath;

    /**
     * @param outputPath 解码结果写入的目标文件路径
     */
    public StreamingUrlDecodeAdapter(Path outputPath) {
        this.outputPath = outputPath;
    }

    /**
     * 流式读取并 URL 解码输入文件，将结果写入构造时指定的输出路径。
     * <p>
     * 由于不在内存中保留完整内容，{@link DecodeResult#getDecoded()} 返回空字符串，
     * 实际内容在 outputPath 文件中。
     *
     * @param request 解码请求，使用其中的 filePath 和 charset
     * @return 成功返回包含统计信息的 Result，失败返回 Result.fail
     */
    @Override
    public Result<DecodeResult> decode(DecodeRequest request) {
        Charset charset = Charset.forName(request.getCharset());
        long[] stats = {0L, 0L}; // [originalBytes, decodedChars]

        try (
            InputStream in = new BufferedInputStream(
                Files.newInputStream(request.getFilePath()), CHUNK_SIZE);
            Writer out = new BufferedWriter(
                new OutputStreamWriter(Files.newOutputStream(outputPath), StandardCharsets.UTF_8))
        ) {
            // pending 用于保存上一块末尾未完整的 %XX 片段（最多 2 个字节）
            byte[] pending = new byte[0];
            byte[] buf = new byte[CHUNK_SIZE];
            int read;

            while ((read = in.read(buf)) > 0) {
                stats[0] += read;

                // 将上一块的末尾残留拼到本块开头，组成待处理的完整字节序列
                byte[] chunk = concat(pending, buf, read);

                // 检查本块末尾是否有未完整的 %XX，截取出来留到下一轮
                int safeLen = safeLengthForUrlDecode(chunk);
                pending = copyOfRange(chunk, safeLen, chunk.length);

                // 对安全部分做 URL 解码并写出
                String raw = new String(chunk, 0, safeLen, StandardCharsets.US_ASCII);
                String decoded = java.net.URLDecoder.decode(raw, charset);
                out.write(decoded);
                stats[1] += decoded.length();
            }

            // 处理最后剩余的 pending（文件末尾不会有不完整的 %XX）
            if (pending.length > 0) {
                String raw = new String(pending, StandardCharsets.US_ASCII);
                String decoded = java.net.URLDecoder.decode(raw, charset);
                out.write(decoded);
                stats[1] += decoded.length();
            }

        } catch (IOException e) {
            log.error("Streaming decode failed: {}", request.getFilePath(), e);
            return Result.fail(e.getMessage());
        }

        log.info("Streaming decode done: originalBytes={}, decodedChars={}, output={}",
                stats[0], stats[1], outputPath);

        return Result.ok(DecodeResult.builder()
                // 流式模式不返回字符串内容，内容已写入 outputPath
                .decoded("[streaming] written to: " + outputPath)
                .originalBytes(stats[0])
                .decodedChars(stats[1])
                .build());
    }

    /**
     * 计算字节数组中可以安全进行 URL 解码的长度。
     * <p>
     * URL 编码的 %XX 占 3 个字节，若块末尾出现：
     * <ul>
     *   <li>单独的 {@code %}：需留 1 字节到下一块</li>
     *   <li>{@code %X}（只有一位十六进制）：需留 2 字节到下一块</li>
     * </ul>
     *
     * @param chunk 当前块的字节数组
     * @return 可安全解码的字节数（不含末尾不完整的 %XX）
     */
    private int safeLengthForUrlDecode(byte[] chunk) {
        int len = chunk.length;
        if (len == 0) return 0;

        // 末尾是 '%'，留 1 字节
        if (chunk[len - 1] == '%') return len - 1;

        // 末尾是 '%X'（倒数第二是 '%'），留 2 字节
        if (len >= 2 && chunk[len - 2] == '%') return len - 2;

        return len;
    }

    /**
     * 将 prefix 和 buf[0..length) 拼接成新的字节数组。
     *
     * @param prefix 前缀（上一块残留）
     * @param buf    当前读取的 buffer
     * @param length buf 中有效字节数
     * @return 拼接后的字节数组
     */
    private byte[] concat(byte[] prefix, byte[] buf, int length) {
        byte[] result = new byte[prefix.length + length];
        System.arraycopy(prefix, 0, result, 0, prefix.length);
        System.arraycopy(buf, 0, result, prefix.length, length);
        return result;
    }

    /**
     * 截取字节数组的子范围 [from, to)，类似 Arrays.copyOfRange。
     *
     * @param src  源数组
     * @param from 起始索引（含）
     * @param to   结束索引（不含）
     * @return 子数组，若 from >= to 返回空数组
     */
    private byte[] copyOfRange(byte[] src, int from, int to) {
        if (from >= to) return new byte[0];
        byte[] result = new byte[to - from];
        System.arraycopy(src, from, result, 0, to - from);
        return result;
    }
}
