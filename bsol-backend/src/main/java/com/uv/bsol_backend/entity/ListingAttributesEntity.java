package com.uv.bsol_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "listing_attributes")

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "listing")
public class ListingAttributesEntity {

    @Id
    @Column(name = "id", nullable = false, unique = true)
    private String id;

    private String attributeName;

    private String attributeValue;

    @ManyToOne
    @JoinColumn(name = "listing_id")
    private ListingsEntity listing;
}
