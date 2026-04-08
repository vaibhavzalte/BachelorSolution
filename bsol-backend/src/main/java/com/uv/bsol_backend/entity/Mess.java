package com.uv.bsol_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "messes")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Mess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔹 Basic Info
    @Column(nullable = false)
    private String title;   // e.g. "Shree Ganesh Mess"

    @Column(columnDefinition = "TEXT")
    private String description;

    // 🔹 Mess Details
    @Column(nullable = false)
    private String foodType; // VEG / NON-VEG / BOTH

    @Column(nullable = false)
    private String mealType; // BREAKFAST / LUNCH / DINNER / ALL

    // 🔹 Pricing
    @Column(nullable = false)
    private Double monthlyFee;

    private Double perMealFee;

    // 🔹 Amenities
    private Boolean homeDelivery;
    private Boolean diningArea;

    // 🔹 Location
    @Column(nullable = false)
    private String address;

    private String city;

    private String area;

    private Double latitude;

    private Double longitude;

    // 🔹 Owner Info
    @Column(nullable = false)
    private String ownerName;

    @Column(nullable = false)
    private String ownerContact;

    private String ownerEmail;

    // 🔹 Status
    @Column(nullable = false)
    private String status; // AVAILABLE / CLOSED / INACTIVE

    // 🔹 Audit Fields
    @CreationTimestamp
    private OffsetDateTime createdAt;

    private String createdBy;

    @UpdateTimestamp
    private OffsetDateTime updatedAt;

    private String updatedBy;
}
