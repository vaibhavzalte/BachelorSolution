package com.uv.app.dto.payload;

import com.uv.app.model.HasImages;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class FoodStallPayload implements HasImages {
    private List<String> images;
    private String stallName;
    private String ownerName;
    private String contactNumber;
    private String location;
    private String foodType;
    private Double rating;
    private Boolean isOpen;
    private OffsetDateTime openingTime;
    private OffsetDateTime closingTime;
    private String description;
}
