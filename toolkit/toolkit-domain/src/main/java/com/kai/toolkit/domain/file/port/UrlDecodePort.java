package com.kai.toolkit.domain.file.port;

import com.kai.toolkit.domain.file.model.DecodeRequest;
import com.kai.toolkit.domain.file.model.DecodeResult;
import com.kai.toolkit.domain.shared.Result;

public interface UrlDecodePort {

    Result<DecodeResult> decode(DecodeRequest request);
}
