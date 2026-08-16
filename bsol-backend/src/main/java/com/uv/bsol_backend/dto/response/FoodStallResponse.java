package com.uv.bsol_backend.dto.response;


import com.uv.bsol_backend.model.CommonResponseFields;
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
public class FoodStallResponse extends CommonResponseFields {


    private String stallName;

    private String ownerName;

    private String contactNumber;
    private String location; // e.g. "Near Gate 2" or full address

    private String foodType; // Veg / Non-Veg / Both

    private Double rating;

    private Boolean isOpen;

    private OffsetDateTime openingTime;

    private OffsetDateTime closingTime;

    private String description;

}
