package com.uv.bsol_backend.repository;

import com.uv.bsol_backend.entity.ListingEntity;
import com.uv.bsol_backend.enums.ListingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ListingsRepository extends JpaRepository<ListingEntity, Long> {
    ListingEntity findByIdAndTypeAndStatus(Long id, String type, ListingStatus status);
}
