package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.dto.payload.RoomVacancyPayload;
import com.uv.bsol_backend.dto.request.RoomVacancyRequest;
import com.uv.bsol_backend.dto.response.RoomVacancyResponse;
import com.uv.bsol_backend.entity.ListingEntity;

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
        return null;
    }


    @Override
    public Class<RoomVacancyRequest> getRequestClass() {
        return null;
    }

    @Override
    public Class<RoomVacancyPayload> getPayloadClass() {
        return null;
    }

    @Override
    public Class<RoomVacancyResponse> getResponseClass() {
        return null;
    }

}
