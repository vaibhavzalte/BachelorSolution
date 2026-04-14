package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.entity.Room;

public class RoomTransformer extends BaseTransformer<Room> {
    public static final String LISTING_TYPE = "Room";
    public RoomTransformer(Room room){
        super(room);
    }

    @Override
    public Long getPrimaryId() {
        return listing.getId();
    }

    @Override
    public String getType() {
        return LISTING_TYPE;
    }

    @Override
    public String getSubType() {
        return listing.getRoomType();
    }

    @Override
    public String getCreatedBy() {
        return listing.getCreatedBy();
    }

    @Override
    public String getUpdatedBy() {
        return listing.getUpdatedBy();
    }

    @Override
    public Double getLatitude() {
        return null;
    }

    @Override
    public Double getLongitude() {
        return null;
    }

    @Override
    public Class<Room> getTransactionClass() {
        return Room.class;
    }
}
