package com.uv.app.dto.payload;

import com.uv.app.model.HasImages;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RoomPayload implements HasImages {
    protected List<String> images;
    private String title;
    private String description;
    private String roomType;
    private String availableFor;
    private Double rent;
    private Double deposit;
    private Double maintenance;
    private Double brokerage;
    private List<String> amenities;
    private String address;
    private String area;
    private String ownerName;
    private String ownerContact;
    private String ownerEmail;
    private String googleMap;
}
