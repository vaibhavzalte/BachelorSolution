package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.dto.payload.FoodStallPayload;
import com.uv.bsol_backend.dto.request.FoodStallRequest;
import com.uv.bsol_backend.dto.response.FoodStallResponse;
import com.uv.bsol_backend.entity.ListingEntity;

import java.util.HashMap;
import java.util.Map;

public class FoodStallTransformer extends BaseTransformer<FoodStallRequest, FoodStallPayload, FoodStallResponse> {
    public static final String LISTING_TYPE = "FoodStall";

    public FoodStallTransformer(FoodStallRequest listing) {
        super(listing);
    }

    @Override
    public String getType() {
        return LISTING_TYPE;
    }

    @Override
    public FoodStallPayload toPayload() {
        return FoodStallPayload.builder()
                .stallName(listing.getStallName())
                .ownerName(listing.getOwnerName())
                .contactNumber(listing.getContactNumber())
                .location(listing.getLocation())
                .foodType(listing.getFoodType())
                .rating(listing.getRating())
                .isOpen(listing.getIsOpen())
                .openingTime(listing.getOpeningTime())
                .closingTime(listing.getClosingTime())
                .description(listing.getDescription())
                .images(listing.getImages())
                .build();
    }

    @Override
    public FoodStallResponse toResponse(FoodStallPayload foodStallPayload, ListingEntity listingEntity) {
        return FoodStallResponse.builder()
                .id(listingEntity.getId())
                .type(listingEntity.getType())
                .subType(listingEntity.getSubType())
                .primaryId(listingEntity.getPrimaryId())
                .city(listingEntity.getCity())
                .latitude(listingEntity.getLatitude())
                .longitude(listingEntity.getLongitude())
                .images(foodStallPayload.getImages())
                .stallName(foodStallPayload.getStallName())
                .ownerName(foodStallPayload.getOwnerName())
                .contactNumber(foodStallPayload.getContactNumber())
                .location(foodStallPayload.getLocation())
                .foodType(foodStallPayload.getFoodType())
                .rating(foodStallPayload.getRating())
                .isOpen(foodStallPayload.getIsOpen())
                .openingTime(foodStallPayload.getOpeningTime())
                .closingTime(foodStallPayload.getClosingTime())
                .description(foodStallPayload.getDescription())
                .build();
    }

    @Override
    public Class<FoodStallRequest> getRequestClass() {
        return FoodStallRequest.class;
    }

    @Override
    public Class<FoodStallPayload> getPayloadClass() {
        return FoodStallPayload.class;
    }

    @Override
    public Class<FoodStallResponse> getResponseClass() {
        return FoodStallResponse.class;
    }

    @Override
    public Map<String, String> getAdditionalAttributes() {
        Map<String, String> attributes = new HashMap<>();
        if (listing.getFoodType() != null) {
            attributes.put("foodType", listing.getFoodType());
        }
        if (listing.getIsOpen() != null) {
            attributes.put("isOpen", listing.getIsOpen().toString());
        }
        return attributes;
    }
}
