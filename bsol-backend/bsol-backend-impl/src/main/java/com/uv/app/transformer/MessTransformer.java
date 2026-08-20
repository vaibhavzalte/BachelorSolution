package com.uv.app.transformer;

import com.uv.app.dto.payload.MessPayload;
import com.uv.app.entity.ListingEntity;
import com.uv.generated.app.model.MessRequest;
import com.uv.generated.app.model.MessResponse;

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
        return new MessResponse()
                .id(listingEntity.getId())
                .type(listingEntity.getType())
                .subType(listingEntity.getSubType())
                .primaryId(listingEntity.getPrimaryId())
                .city(listingEntity.getCity())
                .latitude(listingEntity.getLatitude())
                .longitude(listingEntity.getLongitude())
                .images(messPayload.getImages())
                .status(listingEntity.getStatus() == null ? null : listingEntity.getStatus().name())
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
                .ownerEmail(messPayload.getOwnerEmail());
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
