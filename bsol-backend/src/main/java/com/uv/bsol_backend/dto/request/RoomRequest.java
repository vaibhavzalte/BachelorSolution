package com.uv.bsol_backend.dto.request;

import com.uv.bsol_backend.model.CommonRequestFields;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class RoomRequest extends CommonRequestFields {


    // 🔹 Basic Info
    private String title;
    private String description;

    // 🔹 Room Details
    private String roomType;   // 1RK, 1BHK, 2BHK
    private String availableFor; // BOYS / GIRLS / FAMILY

    // 🔹 Pricing
    private Double rent;
    private Double deposit;
    private Double maintenance;
    private Double brokerage;

    // 🔹 Amenities
    private List<String> amenities;

    // 🔹 Location
    private String address;
    private String area;


    // 🔹 Owner Info
    private String ownerName;
    private String ownerContact;
    private String ownerEmail;

    // Google map link
    private String googleMap;

    // coming soon
    //    private List<String> rules;
    //    private Double rating;

}
