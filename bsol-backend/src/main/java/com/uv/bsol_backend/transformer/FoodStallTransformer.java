package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.dto.payload.FoodStallPayload;
import com.uv.bsol_backend.dto.request.FoodStallRequest;
import com.uv.bsol_backend.dto.response.FoodStallResponse;
import com.uv.bsol_backend.entity.ListingEntity;

public class FoodStallTransformer extends BaseTransformer<FoodStallRequest, FoodStallPayload, FoodStallResponse> {
    public static final String LISTING_TYPE = "FoodStall";

    FoodStallTransformer(FoodStallRequest listing) {
        super(listing);
    }


    @Override
    public String getType() {
        return LISTING_TYPE;
    }

    @Override
    public String getSubType() {
        return null;
    }

    @Override
    public FoodStallPayload toPayload() {
        return null;
    }

    @Override
    public FoodStallResponse toResponse(FoodStallPayload foodStallPayload, ListingEntity listingEntity) {
        return null;
    }


    @Override
    public Class<FoodStallRequest> getRequestClass() {
        return null;
    }

    @Override
    public Class<FoodStallPayload> getPayloadClass() {
        return null;
    }

    @Override
    public Class<FoodStallResponse> getResponseClass() {
        return null;
    }

}
