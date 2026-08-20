package com.uv.app.transformer;

import com.uv.app.entity.ListingEntity;

import java.util.List;
import java.util.Map;

public interface DataTransformer<REQ, PAYLOAD, RES> {

    String getPrimaryId();

    String getCity();

    String getType();

    String getSubType();

    REQ getRequest();

    PAYLOAD toPayload();

    RES toResponse(PAYLOAD payload, ListingEntity listingEntity);

    Double getLatitude();

    Double getLongitude();

    void setImages(List<String> images);

    Class<REQ> getRequestClass();

    Class<PAYLOAD> getPayloadClass();

    Class<RES> getResponseClass();

    Map<String, String> getAdditionalAttributes();
}
