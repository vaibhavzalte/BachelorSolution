package com.uv.app.transformer;

import com.uv.app.dto.payload.StudyRoomPayload;
import com.uv.app.entity.ListingEntity;
import com.uv.generated.app.model.StudyRoomRequest;
import com.uv.generated.app.model.StudyRoomResponse;

import java.util.HashMap;
import java.util.Map;

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
        return StudyRoomPayload.builder()
                .roomName(listing.getRoomName())
                .location(listing.getLocation())
                .capacity(listing.getCapacity())
                .availableSeats(listing.getAvailableSeats())
                .isAvailable(listing.getIsAvailable())
                .hasWifi(listing.getHasWifi())
                .hasChargingPoints(listing.getHasChargingPoints())
                .hasAC(listing.getHasAC())
                .rules(listing.getRules())
                .openingTime(listing.getOpeningTime())
                .closingTime(listing.getClosingTime())
                .rating(listing.getRating())
                .description(listing.getDescription())
                .createdBy(listing.getCreatedBy())
                .images(listing.getImages())
                .build();
    }

    @Override
    public StudyRoomResponse toResponse(StudyRoomPayload studyRoomPayload, ListingEntity listingEntity) {
        return new StudyRoomResponse()
                .id(listingEntity.getId())
                .type(listingEntity.getType())
                .subType(listingEntity.getSubType())
                .primaryId(listingEntity.getPrimaryId())
                .city(listingEntity.getCity())
                .latitude(listingEntity.getLatitude())
                .longitude(listingEntity.getLongitude())
                .images(studyRoomPayload.getImages())
                .status(listingEntity.getStatus() == null ? null : listingEntity.getStatus().name())
                .roomName(studyRoomPayload.getRoomName())
                .location(studyRoomPayload.getLocation())
                .capacity(studyRoomPayload.getCapacity())
                .availableSeats(studyRoomPayload.getAvailableSeats())
                .isAvailable(studyRoomPayload.getIsAvailable())
                .hasWifi(studyRoomPayload.getHasWifi())
                .hasChargingPoints(studyRoomPayload.getHasChargingPoints())
                .hasAC(studyRoomPayload.getHasAC())
                .rules(studyRoomPayload.getRules())
                .openingTime(studyRoomPayload.getOpeningTime())
                .closingTime(studyRoomPayload.getClosingTime())
                .rating(studyRoomPayload.getRating())
                .description(studyRoomPayload.getDescription())
                .createdBy(studyRoomPayload.getCreatedBy())
                .createdAt(listingEntity.getCreateTime())
                .updatedAt(listingEntity.getUpdateTime());
    }

    @Override
    public Class<StudyRoomRequest> getRequestClass() {
        return StudyRoomRequest.class;
    }

    @Override
    public Class<StudyRoomPayload> getPayloadClass() {
        return StudyRoomPayload.class;
    }

    @Override
    public Class<StudyRoomResponse> getResponseClass() {
        return StudyRoomResponse.class;
    }

    @Override
    public Map<String, String> getAdditionalAttributes() {
        Map<String, String> attributes = new HashMap<>();
        if (listing.getIsAvailable() != null) {
            attributes.put("isAvailable", listing.getIsAvailable().toString());
        }
        if (listing.getHasWifi() != null) {
            attributes.put("hasWifi", listing.getHasWifi().toString());
        }
        if (listing.getHasChargingPoints() != null) {
            attributes.put("hasChargingPoints", listing.getHasChargingPoints().toString());
        }
        if (listing.getHasAC() != null) {
            attributes.put("hasAC", listing.getHasAC().toString());
        }
        return attributes;
    }
}
