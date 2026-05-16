package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.dto.RoomPayload;
import com.uv.bsol_backend.entity.Room;

import java.util.Map;

public class RoomTransformer extends BaseTransformer<Room, RoomPayload> {
    public static final String LISTING_TYPE = "Room";

    public RoomTransformer(Room room) {
        super(room);
    }


    @Override
    public String getType() {
        return LISTING_TYPE;
    }


    @Override
    public RoomPayload toDTO() {
        return RoomPayload.builder()
                .title(listing.getTitle())
                .description(listing.getDescription())
                .roomType(listing.getRoomType())
                .availableFor(listing.getAvailableFor())
                .totalRooms(listing.getTotalRooms())
                .availableRooms(listing.getAvailableRooms())
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
                .build();
    }


    @Override
    public Class<Room> getEntityClass() {
        return Room.class;
    }

    @Override
    public Class<RoomPayload> getDtoClass() {
        return RoomPayload.class;
    }

    @Override
    public Map<String, String> getAdditionalAttributes() {
        Map<String, String> attributes = new java.util.HashMap<>();
        if (listing.getRoomType() != null) attributes.put("roomType", listing.getRoomType());
        if (listing.getAvailableFor() != null) attributes.put("availableFor", listing.getAvailableFor());
        return attributes;
    }


}
