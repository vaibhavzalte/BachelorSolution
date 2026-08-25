package com.uv.app.repository;

import com.uv.app.entity.MasterDataEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MasterDataRepository extends JpaRepository<MasterDataEntity, Long> {

    List<MasterDataEntity> findAllByIsActiveTrueOrderByIdAsc();

    Optional<MasterDataEntity> findByGroupCodeAndIsActiveTrue(String groupCode);
}
