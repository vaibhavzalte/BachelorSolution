package com.uv.app.dto.payload;

import com.uv.app.model.HasImages;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class MessPayload implements HasImages {
    protected List<String> images;
    private String messName;
    private String description;
    private String foodType;
    private String mealType;
    private Double monthlyFee;
    private Double perMealFee;
    private Boolean homeDelivery;
    private Boolean diningArea;
    private String address;
    private String area;
    private String ownerName;
    private String ownerContact;
    private String ownerEmail;
}
