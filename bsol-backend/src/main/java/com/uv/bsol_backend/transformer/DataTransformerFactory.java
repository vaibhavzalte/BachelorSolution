package com.uv.bsol_backend.transformer;

import com.uv.bsol_backend.dto.request.*;
import com.uv.bsol_backend.enums.ListingType;
import com.uv.bsol_backend.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

@Service
public class DataTransformerFactory {
    @Autowired
    ObjectMapper objectMapper;

    public DataTransformer<?, ?, ?> getTransformerFor(ListingType type, String payload) {
        return switch (type) {
            case ROOM ->
                    new RoomTransformer(payload == null ? null : objectMapper.readValue(payload, RoomRequest.class));
            case MESS ->
                    new MessTransformer(payload == null ? null : objectMapper.readValue(payload, MessRequest.class));
            case ROOM_VACANCY ->
                    new RoomVacancyTransformer(payload == null ? null : objectMapper.readValue(payload, RoomVacancyRequest.class));
            case FOOD_STALL ->
                    new FoodStallTransformer(payload == null ? null : objectMapper.readValue(payload, FoodStallRequest.class));
            case STUDY_ROOM ->
                    new StudyRoomTransformer(payload == null ? null : objectMapper.readValue(payload, StudyRoomRequest.class));
            default -> throw new BadRequestException("Invalid Listing Type " + type);
        };
    }
}
