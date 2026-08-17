package com.uv.bsol_backend.dto.request;

import com.uv.bsol_backend.model.CommonRequestFields;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.OffsetDateTime;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class StudyRoomRequest extends CommonRequestFields {

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
