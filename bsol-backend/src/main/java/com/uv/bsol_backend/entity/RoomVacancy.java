package com.uv.bsol_backend.entity;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomVacancy extends CommonListingFields {

    //    Listings Entity fields
    private Long id;
    private String type = "RoomVacancy";
    private String subType;
    private String primaryId;
    private String secondaryId;

    private String location;
    private Double latitude;
    private Double longitude;
    private String status;

    private String roomType;        // Single / Double / Triple
    private int totalBeds;
    private int availableBeds;

    private Double rent;
    private Double deposit;
    private Double brokerage;
    private String description;

    private boolean attachedBathroom;
    private boolean furnished;

    private String updatedBy;

    private List<String> amenities; // WiFi, AC, Washing Machine

    private String availableFrom;   // ISO date (String or LocalDate)

    private String preferredTenant; // Male / Female / Any

    private String foodIncluded;    // Yes / No / Optional

    private List<String> images;
}
