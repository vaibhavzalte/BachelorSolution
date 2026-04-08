package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.entity.Room;

public class RoomTransformer extends BaseTransformer<Room> {
    public RoomTransformer(Room room){
        super(room);
    }

    @Override
    public String getPrimaryId() {
        return "room-"+listing.getId();
    }

    @Override
    public String getSecondaryId() {
        return null;
    }

    @Override
    public String getType() {
        return null;
    }

    @Override
    public String getSubType() {
        return null;
    }

    @Override
    public Room getPayload() {
        return listing;
    }

    @Override
    public String getCreatedBy() {
        return null;
    }

    @Override
    public String getUpdatedBy() {
        return null;
    }

    @Override
    public Class<?> getTransactionClass() {
        return null;
    }
}
