package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.dto.payload.MessPayload;
import com.uv.bsol_backend.dto.request.MessRequest;
import com.uv.bsol_backend.dto.response.MessResponse;
import com.uv.bsol_backend.entity.ListingEntity;

import java.util.HashMap;
import java.util.Map;

public class MessTransformer extends BaseTransformer<MessRequest, MessPayload, MessResponse> {
    public static final String LISTING_TYPE = "Mess";

    public MessTransformer(MessRequest mess) {
        super(mess);
    }

    @Override
    public String getType() {
        return LISTING_TYPE;
    }

    @Override
    public MessPayload toPayload() {
        return MessPayload.builder()
                .messName(listing.getMessName())
                .description(listing.getDescription())
                .foodType(listing.getFoodType())
                .mealType(listing.getMealType())
                .monthlyFee(listing.getMonthlyFee())
                .perMealFee(listing.getPerMealFee())
                .homeDelivery(listing.getHomeDelivery())
                .diningArea(listing.getDiningArea())
                .address(listing.getAddress())
                .area(listing.getArea())
                .ownerName(listing.getOwnerName())
                .ownerContact(listing.getOwnerContact())
                .ownerEmail(listing.getOwnerEmail())
                .images(listing.getImages())
                .build();
    }

    @Override
    public MessResponse toResponse(MessPayload messPayload, ListingEntity listingEntity) {
        return MessResponse.builder()
                .id(listingEntity.getId())
                .type(listingEntity.getType())
                .subType(listingEntity.getSubType())
                .primaryId(listingEntity.getPrimaryId())
                .city(listingEntity.getCity())
                .latitude(listingEntity.getLatitude())
                .longitude(listingEntity.getLongitude())
                .images(messPayload.getImages())
                .messName(messPayload.getMessName())
                .description(messPayload.getDescription())
                .foodType(messPayload.getFoodType())
                .mealType(messPayload.getMealType())
                .monthlyFee(messPayload.getMonthlyFee())
                .perMealFee(messPayload.getPerMealFee())
                .homeDelivery(messPayload.getHomeDelivery())
                .diningArea(messPayload.getDiningArea())
                .address(messPayload.getAddress())
                .area(messPayload.getArea())
                .ownerName(messPayload.getOwnerName())
                .ownerContact(messPayload.getOwnerContact())
                .ownerEmail(messPayload.getOwnerEmail())
                .build();
    }

    @Override
    public Class<MessRequest> getRequestClass() {
        return MessRequest.class;
    }

    @Override
    public Class<MessPayload> getPayloadClass() {
        return MessPayload.class;
    }

    @Override
    public Class<MessResponse> getResponseClass() {
        return MessResponse.class;
    }

    @Override
    public Map<String, String> getAdditionalAttributes() {
        Map<String, String> attributes = new HashMap<>();
        if (listing.getFoodType() != null) {
            attributes.put("foodType", listing.getFoodType());
        }
        if (listing.getMealType() != null) {
            attributes.put("mealType", listing.getMealType());
        }
        if (listing.getHomeDelivery() != null) {
            attributes.put("homeDelivery", listing.getHomeDelivery().toString());
        }
        return attributes;
    }
}
