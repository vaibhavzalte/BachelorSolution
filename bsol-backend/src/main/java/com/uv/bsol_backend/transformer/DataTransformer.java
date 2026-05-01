package com.uv.bsol_backend.transformer;

public interface DataTransformer<T> {
    Long getPrimaryId();

    String getSecondaryId();

    String getType();

    String getSubType();

    T getPayload();

    Double getLatitude();

    Double getLongitude();

    Class<?> getTransactionClass();
}