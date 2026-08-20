package com.uv.app.transformer;

import com.uv.app.enums.ListingType;
import com.uv.app.exception.BadRequestException;
import com.uv.generated.app.model.FoodStallRequest;
import com.uv.generated.app.model.MessRequest;
import com.uv.generated.app.model.RoomRequest;
import com.uv.generated.app.model.RoomVacancyRequest;
import com.uv.generated.app.model.StudyRoomRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
public class DataTransformerFactory {

    @Autowired
    private ObjectMapper objectMapper;

    public DataTransformer<?, ?, ?> getTransformerFor(ListingType type) {
        return getTransformerFor(type, null);
    }

    public DataTransformer<?, ?, ?> getTransformerFor(ListingType type, String listingJson) {
        return switch (type) {
            case ROOM -> new RoomTransformer(parseListing(listingJson, RoomRequest.class));
            case MESS -> new MessTransformer(parseListing(listingJson, MessRequest.class));
            case ROOM_VACANCY -> new RoomVacancyTransformer(parseListing(listingJson, RoomVacancyRequest.class));
            case FOOD_STALL -> new FoodStallTransformer(parseListing(listingJson, FoodStallRequest.class));
            case STUDY_ROOM -> new StudyRoomTransformer(parseListing(listingJson, StudyRoomRequest.class));
        };
    }

    private <T> T parseListing(String listingJson, Class<T> targetClass) {
        if (listingJson == null || listingJson.isBlank()) {
            return null;
        }
        try {
            return objectMapper.readValue(listingJson, targetClass);
        } catch (Exception e) {
            throw new BadRequestException("Invalid listing JSON payload");
        }
    }
}
