package com.kai.toolkit.application.file;

import com.kai.toolkit.domain.file.model.DecodeRequest;
import com.kai.toolkit.domain.file.model.DecodeResult;
import com.kai.toolkit.domain.file.port.UrlDecodePort;
import com.kai.toolkit.domain.shared.Result;

import java.nio.file.Path;

public class UrlDecodeService {

    private final UrlDecodePort urlDecodePort;

    public UrlDecodeService(UrlDecodePort urlDecodePort) {
        this.urlDecodePort = urlDecodePort;
    }

    public Result<DecodeResult> decodeFile(Path filePath) {
        return urlDecodePort.decode(DecodeRequest.builder()
                .filePath(filePath)
                .build());
    }

    public Result<DecodeResult> decodeFile(Path filePath, boolean prettyPrint) {
        return urlDecodePort.decode(DecodeRequest.builder()
                .filePath(filePath)
                .prettyPrint(prettyPrint)
                .build());
    }
}
