package com.uv.app.transformer;

import com.uv.app.dto.payload.RoomPayload;
import com.uv.app.entity.ListingEntity;
import com.uv.generated.app.model.RoomRequest;
import com.uv.generated.app.model.RoomResponse;

import java.util.HashMap;
import java.util.Map;

public class RoomTransformer extends BaseTransformer<RoomRequest, RoomPayload, RoomResponse> {
    public static final String LISTING_TYPE = "Room";

    public RoomTransformer(RoomRequest room) {
        super(room);
    }

    @Override
    public String getType() {
        return LISTING_TYPE;
    }

    @Override
    public RoomPayload toPayload() {
        return RoomPayload.builder()
                .title(listing.getTitle())
                .description(listing.getDescription())
                .roomType(listing.getRoomType())
                .availableFor(listing.getAvailableFor())
                .rent(listing.getRent())
                .deposit(listing.getDeposit())
                .maintenance(listing.getMaintenance())
                .brokerage(listing.getBrokerage())
                .amenities(listing.getAmenities())
                .address(listing.getAddress())
                .area(listing.getArea())
                .images(listing.getImages())
                .ownerContact(listing.getOwnerContact())
                .ownerName(listing.getOwnerName())
                .ownerEmail(listing.getOwnerEmail())
                .googleMap(listing.getGoogleMap())
                .build();
    }

    @Override
    public RoomResponse toResponse(RoomPayload roomPayload, ListingEntity entity) {
        return new RoomResponse()
                .id(entity.getId())
                .type(entity.getType())
                .subType(entity.getSubType())
                .primaryId(entity.getPrimaryId())
                .city(entity.getCity())
                .latitude(entity.getLatitude())
                .longitude(entity.getLongitude())
                .images(roomPayload.getImages())
                .status(entity.getStatus() == null ? null : entity.getStatus().name())
                .title(roomPayload.getTitle())
                .description(roomPayload.getDescription())
                .roomType(roomPayload.getRoomType())
                .availableFor(roomPayload.getAvailableFor())
                .rent(roomPayload.getRent())
                .deposit(roomPayload.getDeposit())
                .maintenance(roomPayload.getMaintenance())
                .brokerage(roomPayload.getBrokerage())
                .amenities(roomPayload.getAmenities())
                .address(roomPayload.getAddress())
                .area(roomPayload.getArea())
                .ownerContact(roomPayload.getOwnerContact())
                .ownerName(roomPayload.getOwnerName())
                .ownerEmail(roomPayload.getOwnerEmail())
                .googleMap(roomPayload.getGoogleMap());
    }

    @Override
    public Class<RoomRequest> getRequestClass() {
        return RoomRequest.class;
    }

    @Override
    public Class<RoomPayload> getPayloadClass() {
        return RoomPayload.class;
    }

    @Override
    public Class<RoomResponse> getResponseClass() {
        return RoomResponse.class;
    }

    @Override
    public Map<String, String> getAdditionalAttributes() {
        Map<String, String> attributes = new HashMap<>();
        if (listing.getRoomType() != null) {
            attributes.put("roomType", listing.getRoomType());
        }
        if (listing.getAvailableFor() != null) {
            attributes.put("availableFor", listing.getAvailableFor());
        }
        return attributes;
    }
}
