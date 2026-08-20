package com.uv.app.dto.payload;

import com.uv.app.model.HasImages;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RoomVacancyPayload implements HasImages {
    protected List<String> images;
    private String title;
    private String description;
    private String roomType;
    private Integer totalVacancies;
    private String preferredTenant;
    private Double rent;
    private Double deposit;
    private Double maintenance;
    private Double brokerage;
    private List<String> amenities;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private OffsetDateTime availableFrom;
    private String address;
    private String area;
    private String ownerName;
    private String ownerContact;
    private String ownerEmail;
    private String googleMap;
}
