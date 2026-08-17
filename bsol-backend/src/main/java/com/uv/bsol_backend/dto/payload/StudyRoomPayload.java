package com.uv.bsol_backend.dto.payload;

import com.uv.bsol_backend.model.HasImages;
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

    private String roomName; // e.g. "Silent Study Room A"

    private String location; // e.g. "2nd Floor, Building B"

    private Integer capacity; // total seats

    private Integer availableSeats;

    private Boolean isAvailable; // room open or not

    private Boolean hasWifi;

    private Boolean hasChargingPoints;

    private Boolean hasAC;

    private String rules; // e.g. "No talking, No phone calls"

    private OffsetDateTime openingTime;

    private OffsetDateTime closingTime;

    private Double rating;

    private String description;

    private String createdBy;

}