package com.uv.bsol_backend.service;

import com.uv.bsol_backend.entity.ListingsEntity;
import com.uv.bsol_backend.repository.ListingsRepository;
import com.uv.bsol_backend.transformer.DataTransformer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ListingService {

    @Autowired
    private ListingsRepository listingsRepository;

    public <T> T createListing(DataTransformer<?> transformer) {
       ListingsEntity entity = listingsRepository.findByIdAndTypeAndStatus(transformer.getPrimaryId(), transformer.getType(), "ACTIVE");
         if(entity != null) {
              throw new RuntimeException("Listing already exists with primary id: " + transformer.getPrimaryId() + " and type: " + transformer.getType());
         }
        ListingsEntity newEntity = ListingsEntity.builder()
                .id(transformer.getPrimaryId())
                .primaryId(transformer.getPrimaryId().toString())
                .secondaryId(transformer.getSecondaryId())
                .type(transformer.getType())
                .build();
}
