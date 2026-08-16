package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.dto.payload.MessPayload;
import com.uv.bsol_backend.dto.request.MessRequest;
import com.uv.bsol_backend.dto.response.MessResponse;
import com.uv.bsol_backend.entity.ListingEntity;

public class MessTransformer extends BaseTransformer<MessRequest, MessPayload, MessResponse> {
    public static final String LISTING_TYPE = "Mess";

    MessTransformer(MessRequest mess) {
        super(mess);
    }

    @Override
    public String getType() {
        return LISTING_TYPE;
    }

    @Override
    public MessPayload toPayload() {
        return null;
    }

    @Override
    public MessResponse toResponse(MessPayload messPayload, ListingEntity listingEntity) {
        return null;
    }

    @Override
    public Class<MessRequest> getRequestClass() {
        return null;
    }

    @Override
    public Class<MessPayload> getPayloadClass() {
        return null;
    }

    @Override
    public Class<MessResponse> getResponseClass() {
        return null;
    }


}
