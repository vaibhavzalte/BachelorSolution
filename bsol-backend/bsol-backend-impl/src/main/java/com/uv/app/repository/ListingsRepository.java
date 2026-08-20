package com.uv.app.repository;

import com.uv.app.entity.ListingEntity;
import com.uv.app.enums.ListingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ListingsRepository extends JpaRepository<ListingEntity, Long> {
    ListingEntity findByIdAndTypeAndStatus(Long id, String type, ListingStatus status);
}
