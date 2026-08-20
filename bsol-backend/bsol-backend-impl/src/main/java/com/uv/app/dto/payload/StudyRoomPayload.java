package com.uv.app.dto.payload;

import com.uv.app.model.HasImages;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudyRoomPayload implements HasImages {
    private List<String> images;
    private String roomName;
    private String location;
    private Integer capacity;
    private Integer availableSeats;
    private Boolean isAvailable;
    private Boolean hasWifi;
    private Boolean hasChargingPoints;
    private Boolean hasAC;
    private String rules;
    private OffsetDateTime openingTime;
    private OffsetDateTime closingTime;
    private Double rating;
    private String description;
    private String createdBy;
}
