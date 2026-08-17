package com.uv.bsol_backend.dto.response;

import com.uv.bsol_backend.model.CommonResponseFields;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class MessResponse extends CommonResponseFields {

    // 🔹 Basic Info
    private String messName;

    private String description;

    // 🔹 Mess Details
    private String foodType; // VEG / NON-VEG / BOTH

    private String mealType; // BREAKFAST / LUNCH / DINNER / ALL

    // 🔹 Pricing
    private Double monthlyFee;

    private Double perMealFee;

    // 🔹 Amenities
    private Boolean homeDelivery;
    private Boolean diningArea;

    // 🔹 Location
    private String address;
    private String area;

    // 🔹 Owner Info
    private String ownerName;

    private String ownerContact;

    private String ownerEmail;
}
