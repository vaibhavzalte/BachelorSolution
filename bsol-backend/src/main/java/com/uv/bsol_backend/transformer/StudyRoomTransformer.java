package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.dto.payload.StudyRoomPayload;
import com.uv.bsol_backend.dto.request.StudyRoomRequest;
import com.uv.bsol_backend.dto.response.StudyRoomResponse;
import com.uv.bsol_backend.entity.ListingEntity;

public class StudyRoomTransformer extends BaseTransformer<StudyRoomRequest, StudyRoomPayload, StudyRoomResponse> {
    public static final String LISTING_TYPE = "StudyRoom";

    public StudyRoomTransformer(StudyRoomRequest studyRoom) {
        super(studyRoom);
    }

    @Override
    public String getType() {
        return LISTING_TYPE;
    }

    @Override
    public StudyRoomPayload toPayload() {
        return null;
    }

    @Override
    public StudyRoomResponse toResponse(StudyRoomPayload studyRoomPayload, ListingEntity listingEntity) {
        return null;
    }

    @Override
    public Class<StudyRoomRequest> getRequestClass() {
        return null;
    }

    @Override
    public Class<StudyRoomPayload> getPayloadClass() {
        return null;
    }

    @Override
    public Class<StudyRoomResponse> getResponseClass() {
        return null;
    }


}
