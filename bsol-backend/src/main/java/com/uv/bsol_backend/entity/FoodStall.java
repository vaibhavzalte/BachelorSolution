package com.uv.bsol_backend.entity;


import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FoodStall {
    private Long id;
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
    @CreationTimestamp
    private OffsetDateTime createdAt;

    private String createdBy;

    @UpdateTimestamp
    private OffsetDateTime updatedAt;

}
