package com.uv.bsol_backend.dto.response;

import com.uv.bsol_backend.model.CommonResponseFields;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class RoomVacancyResponse extends CommonResponseFields {
    // 🔹 Basic Info
    private String title;
    private String description;

    private String roomType;
    private int totalVacancies;
    private String preferredTenant; // Male / Female / Any

    private Double rent;
    private Double deposit;
    private Double maintenance;
    private Double brokerage;

    private List<String> amenities; // WiFi, AC, Washing Machine

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private OffsetDateTime availableFrom;
    // 🔹 Location
    private String address;
    private String area;


    // 🔹 Owner Info
    private String ownerName;
    private String ownerContact;
    private String ownerEmail;
    // 🔹 Google Map link
    private String googleMap;
}
