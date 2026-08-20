package com.uv.app.transformer;

import com.uv.app.dto.payload.RoomVacancyPayload;
import com.uv.app.entity.ListingEntity;
import com.uv.generated.app.model.RoomVacancyRequest;
import com.uv.generated.app.model.RoomVacancyResponse;

import java.util.HashMap;
import java.util.Map;

public class RoomVacancyTransformer extends BaseTransformer<RoomVacancyRequest, RoomVacancyPayload, RoomVacancyResponse> {
    public static final String LISTING_TYPE = "RoomVacancy";

    public RoomVacancyTransformer(RoomVacancyRequest roomVacancy) {
        super(roomVacancy);
    }

    @Override
    public String getType() {
        return LISTING_TYPE;
    }

    @Override
    public RoomVacancyPayload toPayload() {
        return RoomVacancyPayload.builder()
                .title(listing.getTitle())
                .description(listing.getDescription())
                .roomType(listing.getRoomType())
                .totalVacancies(listing.getTotalVacancies())
                .preferredTenant(listing.getPreferredTenant())
                .rent(listing.getRent())
                .deposit(listing.getDeposit())
                .maintenance(listing.getMaintenance())
                .brokerage(listing.getBrokerage())
                .amenities(listing.getAmenities())
                .availableFrom(listing.getAvailableFrom())
                .address(listing.getAddress())
                .area(listing.getArea())
                .ownerContact(listing.getOwnerContact())
                .ownerName(listing.getOwnerName())
                .ownerEmail(listing.getOwnerEmail())
                .images(listing.getImages())
                .googleMap(listing.getGoogleMap())
                .build();
    }

    @Override
    public RoomVacancyResponse toResponse(RoomVacancyPayload payload, ListingEntity listingEntity) {
        return new RoomVacancyResponse()
                .id(listingEntity.getId())
                .type(listingEntity.getType())
                .subType(listingEntity.getSubType())
                .primaryId(listingEntity.getPrimaryId())
                .city(listingEntity.getCity())
                .latitude(listingEntity.getLatitude())
                .longitude(listingEntity.getLongitude())
                .images(payload.getImages())
                .status(listingEntity.getStatus() == null ? null : listingEntity.getStatus().name())
                .title(payload.getTitle())
                .description(payload.getDescription())
                .roomType(payload.getRoomType())
                .totalVacancies(payload.getTotalVacancies())
                .preferredTenant(payload.getPreferredTenant())
                .rent(payload.getRent())
                .deposit(payload.getDeposit())
                .maintenance(payload.getMaintenance())
                .brokerage(payload.getBrokerage())
                .amenities(payload.getAmenities())
                .availableFrom(payload.getAvailableFrom())
                .address(payload.getAddress())
                .area(payload.getArea())
                .ownerContact(payload.getOwnerContact())
                .ownerName(payload.getOwnerName())
                .ownerEmail(payload.getOwnerEmail())
                .googleMap(payload.getGoogleMap());
    }

    @Override
    public Class<RoomVacancyRequest> getRequestClass() {
        return RoomVacancyRequest.class;
    }

    @Override
    public Class<RoomVacancyPayload> getPayloadClass() {
        return RoomVacancyPayload.class;
    }

    @Override
    public Class<RoomVacancyResponse> getResponseClass() {
        return RoomVacancyResponse.class;
    }

    @Override
    public Map<String, String> getAdditionalAttributes() {
        Map<String, String> attributes = new HashMap<>();
        if (listing.getRoomType() != null) {
            attributes.put("roomType", listing.getRoomType());
        }
        if (listing.getPreferredTenant() != null) {
            attributes.put("preferredTenant", listing.getPreferredTenant());
        }
        if (listing.getTotalVacancies() != null) {
            attributes.put("totalVacancies", String.valueOf(listing.getTotalVacancies()));
        }
        return attributes;
    }
}
