package com.kai.toolkit.starter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.kai.toolkit.application.file.UrlDecodeService;
import com.kai.toolkit.domain.file.model.DecodeResult;
import com.kai.toolkit.domain.shared.Result;
import com.kai.toolkit.infrastructure.file.NioUrlDecodeAdapter;

import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * 独立运行：解码 URL 编码的大文件并输出到控制台或文件
 * 用法：java UrlDecodeRunner <input-file> [output-file]
 */
public class UrlDecodeRunner {

    public static void main(String[] args) throws Exception {
        if (args.length < 1) {
            System.err.println("Usage: UrlDecodeRunner <input-file> [output-file]");
            System.exit(1);
        }

        Path inputPath = Paths.get(args[0]);
        ObjectMapper mapper = new ObjectMapper().registerModule(new JavaTimeModule());
        UrlDecodeService service = new UrlDecodeService(new NioUrlDecodeAdapter(mapper));

        long start = System.currentTimeMillis();
        Result<DecodeResult> result = service.decodeFile(inputPath);
        long elapsed = System.currentTimeMillis() - start;

        if (!result.isSuccess()) {
            System.err.println("Decode failed: " + result.getErrorMessage());
            System.exit(2);
        }

        DecodeResult data = result.getData();
        System.err.printf("[Done] original=%d bytes, decoded=%d chars, elapsed=%dms%n",
                data.getOriginalBytes(), data.getDecodedChars(), elapsed);

        if (args.length >= 2) {
            Path outputPath = Paths.get(args[1]);
            java.nio.file.Files.writeString(outputPath, data.getDecoded(),
                    java.nio.charset.StandardCharsets.UTF_8);
            System.err.println("Output written to: " + outputPath.toAbsolutePath());
        } else {
            System.out.println(data.getDecoded());
        }
    }
}
