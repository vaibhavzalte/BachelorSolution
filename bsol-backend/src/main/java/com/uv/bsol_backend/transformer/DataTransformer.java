package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.entity.ListingEntity;

import java.util.List;
import java.util.Map;

public interface DataTransformer<REQ, PAYLOAD, RES> {

    String getPrimaryId();

    String getCity();

    String getType();

    String getSubType();

    /**
     * Original request object received from the API.
     */
    REQ getRequest();

    /**
     * Converts the request/model into the payload
     * that will be stored inside ListingsEntity.payload.
     */
    PAYLOAD toPayload();

    /**
     * Converts the stored payload + common listing information
     * into the response returned by the API.
     */
    RES toResponse(PAYLOAD payload, ListingEntity listingEntity);

    Double getLatitude();

    Double getLongitude();

    void setImages(List<String> images);

    Class<REQ> getRequestClass();

    Class<PAYLOAD> getPayloadClass();

    Class<RES> getResponseClass();

    Map<String, String> getAdditionalAttributes();
}