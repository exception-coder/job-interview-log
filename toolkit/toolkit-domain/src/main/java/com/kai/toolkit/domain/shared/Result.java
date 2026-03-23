package com.kai.toolkit.domain.shared;

/**
 * 通用结果封装，避免抛出受检异常穿透层边界
 */
public final class Result<T> {

    private final T data;
    private final String errorMessage;
    private final boolean success;

    private Result(T data, String errorMessage, boolean success) {
        this.data = data;
        this.errorMessage = errorMessage;
        this.success = success;
    }

    public static <T> Result<T> ok(T data) {
        return new Result<>(data, null, true);
    }

    public static <T> Result<T> fail(String errorMessage) {
        return new Result<>(null, errorMessage, false);
    }

    public boolean isSuccess() {
        return success;
    }

    public T getData() {
        return data;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    @Override
    public String toString() {
        return success ? "Result{ok, data=" + data + "}" : "Result{fail, error='" + errorMessage + "'}";
    }
}
