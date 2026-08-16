package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.model.CommonRequestFields;

import java.util.Collections;
import java.util.List;
import java.util.Map;

public abstract class BaseTransformer<REQ extends CommonRequestFields, PAYLOAD, RES> implements DataTransformer<REQ, PAYLOAD, RES> {
    // common logic here
    protected REQ listing;

    protected BaseTransformer(REQ listing) {
        this.listing = listing;
    }


    @Override
    public String getPrimaryId() {
        return listing.getPrimaryId();
    }

    @Override
    public String getCity() {
        return listing.getCity();
    }

    @Override
    public String getSubType() {
        return listing.getSubType();
    }

    @Override
    public Double getLatitude() {
        return listing.getLatitude();
    }

    @Override
    public Double getLongitude() {
        return listing.getLongitude();
    }

    @Override
    public void setImages(List<String> images) {
        listing.setImages(images);
    }

    @Override
    public REQ getRequest() {
        return listing;
    }

    @Override
    public Map<String, String> getAdditionalAttributes() {
        return Collections.emptyMap();
    }
}
