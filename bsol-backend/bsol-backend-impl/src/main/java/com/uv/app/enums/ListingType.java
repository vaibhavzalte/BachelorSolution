package com.uv.app.enums;

public enum ListingType {
    ROOM("Room"),
    MESS("Mess"),
    ROOM_VACANCY("RoomVacancy"),
    FOOD_STALL("FoodStall"),
    STUDY_ROOM("StudyRoom");

    private final String value;

    ListingType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static ListingType fromValue(String value) {
        for (ListingType listingType : ListingType.values()) {
            if (listingType.value.equals(value)) {
                return listingType;
            }
        }
        throw new IllegalArgumentException("Unexpected value '" + value + "'");
    }
}
