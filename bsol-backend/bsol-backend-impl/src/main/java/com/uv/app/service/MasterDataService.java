package com.uv.app.service;

import com.uv.app.dto.seed.MasterSeedFile;
import com.uv.app.dto.seed.MasterSeedGroup;
import com.uv.app.entity.MasterDataEntity;
import com.uv.app.exception.MasterGroupNotFoundException;
import com.uv.app.repository.MasterDataRepository;
import com.uv.generated.app.model.MasterCatalogResponse;
import com.uv.generated.app.model.MasterGroupResponse;
import com.uv.generated.app.model.MasterSeedResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MasterDataService {

    private static final String MASTER_DATA_RESOURCE = "master-data.json";

    private final MasterDataRepository masterDataRepository;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public MasterCatalogResponse getMasters() {
        List<MasterDataEntity> arrEntities = masterDataRepository.findAllByIsActiveTrueOrderByIdAsc();
        List<MasterGroupResponse> arrGroups = new ArrayList<>();
        if (arrEntities != null) {
            for (MasterDataEntity objEntity : arrEntities) {
                arrGroups.add(toGroupResponse(objEntity));
            }
        }
        return new MasterCatalogResponse().groups(arrGroups);
    }

    @Transactional(readOnly = true)
    public MasterGroupResponse getMastersByGroup(String strGroupCode) {
        MasterDataEntity objEntity = masterDataRepository.findByGroupCodeAndIsActiveTrue(strGroupCode)
                .orElseThrow(() -> new MasterGroupNotFoundException(strGroupCode));
        return toGroupResponse(objEntity);
    }

    @Transactional
    public MasterSeedResponse seedMasters() {
        long lngExistingCount = masterDataRepository.count();
        if (lngExistingCount > 0) {
            log.info("Master data already exists ({} rows); seed skipped", lngExistingCount);
            return new MasterSeedResponse()
                    .seeded(false)
                    .skipped(true)
                    .itemCount((int) lngExistingCount)
                    .message("Master data already exists; seed skipped");
        }

        MasterSeedFile objSeedFile = loadSeedFile();
        List<MasterDataEntity> arrEntities = new ArrayList<>();

        if (objSeedFile != null && objSeedFile.getGroups() != null) {
            for (MasterSeedGroup objGroup : objSeedFile.getGroups()) {
                if (objGroup == null || objGroup.getData() == null || objGroup.getData().isEmpty()) {
                    continue;
                }
                arrEntities.add(
                        MasterDataEntity.builder()
                                .groupCode(objGroup.getGroupCode())
                                .groupLabel(objGroup.getGroupLabel())
                                .data(new ArrayList<>(objGroup.getData()))
                                .isActive(true)
                                .build()
                );
            }
        }

        List<MasterDataEntity> arrSaved = masterDataRepository.saveAll(arrEntities);
        log.info("Seeded {} master data rows from {}", arrSaved.size(), MASTER_DATA_RESOURCE);
        return new MasterSeedResponse()
                .seeded(true)
                .skipped(false)
                .itemCount(arrSaved.size())
                .message("Master data seeded");
    }

    private MasterSeedFile loadSeedFile() {
        ClassPathResource objResource = new ClassPathResource(MASTER_DATA_RESOURCE);
        try (InputStream objInputStream = objResource.getInputStream()) {
            return objectMapper.readValue(objInputStream, MasterSeedFile.class);
        } catch (IOException objException) {
            throw new IllegalStateException("Unable to read " + MASTER_DATA_RESOURCE, objException);
        }
    }

    private MasterGroupResponse toGroupResponse(MasterDataEntity objEntity) {
        List<String> arrData = objEntity.getData() != null ? objEntity.getData() : List.of();
        return new MasterGroupResponse()
                .id(objEntity.getId())
                .groupCode(objEntity.getGroupCode())
                .groupLabel(objEntity.getGroupLabel())
                .data(new ArrayList<>(arrData))
                .isActive(objEntity.getIsActive());
    }
}
