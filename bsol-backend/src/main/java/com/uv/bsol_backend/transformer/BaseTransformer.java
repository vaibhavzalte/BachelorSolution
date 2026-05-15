package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.entity.CommonListingFields;

import java.util.Collections;
import java.util.List;
import java.util.Map;

public abstract class BaseTransformer<E extends CommonListingFields, D> implements DataTransformer<E, D> {
    // common logic here
    protected E listing;

    BaseTransformer(E listing) {
        this.listing = listing;
    }

    @Override
    public Long getId() {
        return null;
    }

    @Override
    public String getPrimaryId() {
        return listing.getPrimaryId();
    }

    @Override
    public void setImages(List<String> images) {
        listing.setImages(images);
    }

    @Override
    public E getEntity() {
        return listing;
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
    public Map<String,String> getAdditionalAttributes(){
        return Collections.emptyMap();
    }
}
