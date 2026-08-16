package com.uv.bsol_backend.service;

import com.uv.bsol_backend.entity.ListingAttributesEntity;
import com.uv.bsol_backend.entity.ListingEntity;
import com.uv.bsol_backend.enums.ListingStatus;
import com.uv.bsol_backend.exception.DuplicateListingException;
import com.uv.bsol_backend.exception.FileStorageException;
import com.uv.bsol_backend.exception.ListingNotFoundException;
import com.uv.bsol_backend.model.CommonRequestFields;
import com.uv.bsol_backend.repository.ListingAttributesRepository;
import com.uv.bsol_backend.repository.ListingsRepository;
import com.uv.bsol_backend.transformer.DataTransformer;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ListingService {

    @Autowired
    private ListingsRepository listingsRepository;
    @Autowired
    private ListingAttributesRepository attributesRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private FileStorageService fileStorageService;

    private static void addFixedQueryCondition(
            String paramName,
            Map<String, String> allParams,
            StringBuilder query,
            Map<String, Object> filterValues
    ) {
        String paramValue = allParams.get(paramName);
        if (paramValue != null && !paramValue.isEmpty()) {
            query.append(" AND  t1.").append(paramName).append(" = :").append(paramName);
            filterValues.put(paramName, paramValue);
            allParams.remove(paramName);
        }
    }

    public <REQ, PAYLOAD, RES> RES createListingWithImages(
            DataTransformer<REQ, PAYLOAD, RES> transformer,
            List<MultipartFile> images
    ) {
        if (images != null && !images.isEmpty()) {
            try {
                List<String> imageUrls = fileStorageService.storeFiles(images);
                transformer.setImages(imageUrls);
            } catch (java.io.IOException e) {
                log.error("Failed to store images", e);
                throw new FileStorageException("Failed to store images", e);
            }
        }
        return createListing(transformer);
    }

    @Transactional
    public <REQ, PAYLOAD, RES> RES createListing(
            DataTransformer<REQ, PAYLOAD, RES> transformer
    ) {
//         Request -> Transformer -> Payload -> JSON -> ListingsEntity
        ListingEntity newEntity = ListingEntity.builder()
                .type(transformer.getType())
                .subType(transformer.getSubType())
                .primaryId(transformer.getPrimaryId())
                .city(transformer.getCity())
                .latitude(transformer.getLatitude())
                .longitude(transformer.getLongitude())
                .payload(getJsonString(transformer.toPayload()))
                .status(ListingStatus.ACTIVE)
                .build();

        ListingEntity listingDB = listingsRepository.save(newEntity);

        Map<String, String> additionalAttributes = transformer.getAdditionalAttributes();
        List<ListingAttributesEntity> attributesEntities = new ArrayList<>();
        if (additionalAttributes != null) {

            additionalAttributes.forEach((key, value) -> {

                ListingAttributesEntity attributesEntity =
                        ListingAttributesEntity.builder()
                                .listing(listingDB)
                                .attributeName(key)
                                .attributeValue(value)
                                .id(listingDB.getId() + key)
                                .build();

                attributesEntities.add(attributesEntity);
            });
        }

        if (!attributesEntities.isEmpty()) {
            attributesRepository.saveAll(
                    attributesEntities
            );
        }

        return mapToResponse(listingDB, transformer);
    }

    public <REQ, PAYLOAD, RES> RES getListingById(
            Long id,
            DataTransformer<REQ, PAYLOAD, RES> transformer
    ) {
        ListingEntity entity = listingsRepository.findByIdAndTypeAndStatus(id, transformer.getType(), ListingStatus.ACTIVE);
        if (entity == null) {
            log.info("Listing not found with id: {}", id);
            throw new ListingNotFoundException(transformer.getType() + " not found with id: " + id);
        }
        return mapToResponse(entity, transformer);
    }

    public <REQ, PAYLOAD, RES> List<RES> getListingsByTypeAndFilters(
            DataTransformer<REQ, PAYLOAD, RES> transformer,
            Map<String, String> allParams
    ) {
        log.info("Creating listing query...");
        StringBuilder query =
                new StringBuilder(
                        "SELECT DISTINCT t1 FROM ListingEntity t1 " +
                                "WHERE t1.type = :type " +
                                "AND t1.status = :status"
                );
        Map<String, Object> filterParams = addFilterConditions(query, allParams);
        filterParams.put(
                "type", transformer.getType()
        );
        filterParams.put("status", ListingStatus.ACTIVE);
        TypedQuery<ListingEntity> listingsQuery = entityManager.createQuery(query.toString(), ListingEntity.class);
        setFilterParameters(listingsQuery, filterParams);
        List<ListingEntity> listings = listingsQuery.getResultList();

        List<RES> responseList = new ArrayList<>();
        for (ListingEntity entity : listings) {
            RES response = mapToResponse(entity, transformer);
            responseList.add(response);
        }
        return responseList;
    }

    @Transactional
    public <REQ, PAYLOAD, RES> RES updateListingById(
            Long id,
            DataTransformer<REQ, PAYLOAD, RES> transformer,
            List<MultipartFile> images
    ) {
        ListingEntity entity = listingsRepository.findByIdAndTypeAndStatus(id, transformer.getType(), ListingStatus.ACTIVE);
        if (entity == null) {
            log.info("Listing not found with id: {}", id);
            throw new ListingNotFoundException(transformer.getType() + " not found with id: " + id);
        }
        if (images != null && !images.isEmpty()) {
            try {
                List<String> imageUrls = fileStorageService.storeFiles(images);
                transformer.setImages(imageUrls);
            } catch (java.io.IOException e) {
                log.error("Failed to store images during update", e);
                throw new FileStorageException("Failed to store images", e);
            }
        }
        ListingEntity updated = entity.toBuilder()
                .subType(transformer.getSubType())
                .primaryId(transformer.getPrimaryId())
                .city(transformer.getCity())
                .latitude(transformer.getLatitude())
                .longitude(transformer.getLongitude())
                .payload(getJsonString(transformer.toPayload()))
                .build();

        ListingEntity saved = listingsRepository.save(updated);

        attributesRepository.deleteAllById(entity.getListingAttributes().stream().map(ListingAttributesEntity::getId).collect(Collectors.toSet()));
        attributesRepository.flush();
        Map<String, String> additionalAttributes = transformer.getAdditionalAttributes();
        List<ListingAttributesEntity> attributesEntities = new ArrayList<>();
        if (additionalAttributes != null) {
            additionalAttributes.forEach((key, value) -> {
                ListingAttributesEntity attribute =
                        ListingAttributesEntity.builder()
                                .id(saved.getId().toString()+key)
                                .listing(saved)
                                .attributeName(key)
                                .attributeValue(value)
                                .build();
                attributesEntities.add(attribute);
            });
            if (!attributesEntities.isEmpty()) {

                attributesRepository.saveAll(
                        attributesEntities
                );
            }
        }
        log.info("Updated listing with id: {}", id);
        return mapToResponse(saved, transformer);
    }

    @Transactional
    public <REQ, PAYLOAD, RES> void deleteListingById(
            DataTransformer<REQ, PAYLOAD, RES> transformer,
            Long id
    ) {
        ListingEntity entity = listingsRepository.findByIdAndTypeAndStatus(id, transformer.getType(), ListingStatus.ACTIVE);
        if (entity == null) {
            log.info("Listing not found with id: {}", id);
            throw new ListingNotFoundException(transformer.getType() + " not found with id: " + id);
        }
        entity.setStatus(ListingStatus.INACTIVE);
        listingsRepository.save(entity);
    }

    private <REQ, PAYLOAD, RES> RES mapToResponse(
            ListingEntity entity,
            DataTransformer<REQ, PAYLOAD, RES> transformer
    ) {
        if (entity == null || entity.getPayload() == null) {
            return null;
        }
//        Database -> ListingsEntity.payload -> JSON -> RoomPayload

        PAYLOAD payload = objectMapper.readValue(
                entity.getPayload(),
                transformer.getPayloadClass()
        );
//        LOAD IMAGES
        if (payload instanceof CommonRequestFields payloadFields) {
            if (payloadFields.getImages() != null) {
                List<String> base64Images = new ArrayList<>();
                for (String url : payloadFields.getImages()) {
                    try {
                        byte[] bytes = fileStorageService.loadFile(url);
                        String base64 = Base64.getEncoder().encodeToString(bytes);
                        String mimeType = "image/jpeg";
                        if (url.toLowerCase().endsWith(".png")) {
                            mimeType = "image/png";
                        } else if (url.toLowerCase().endsWith(".gif")) {
                            mimeType = "image/gif";
                        } else if (url.toLowerCase().endsWith(".webp")) {
                            mimeType = "image/webp";
                        }
                        base64Images.add("data:" + mimeType + ";base64," + base64);
                    } catch (IOException e) {
                        log.error("Failed to load image: {}", url, e);
                    }
                }
                payloadFields.setImages(base64Images);
            }
        }
//      RoomPayload -> RoomTransformer -> RoomResponse
        return transformer.toResponse(payload, entity);
    }

    private String getJsonString(Object object) {
        return objectMapper.writeValueAsString(object);
    }

    private void setFilterParameters(
            TypedQuery<ListingEntity> listingQuery,
            Map<String, Object> filterParams
    ) {
        filterParams.keySet().forEach(key -> listingQuery.setParameter(key, filterParams.get(key)));
    }

    private Map<String, Object> addFilterConditions(
            StringBuilder query,
            Map<String, String> allParams
    ) {
        Map<String, Object> filterValues = new HashMap<>();
        if (allParams != null && !allParams.isEmpty()) {
            allParams.remove("rentSort");
            addFixedQueryCondition("subType", allParams, query, filterValues);
            addFixedQueryCondition("city", allParams, query, filterValues);
            addFixedQueryCondition("primaryId", allParams, query, filterValues);
            addFreshnessCondition(allParams, query, filterValues);
            addFlexQueryConditions(allParams, query, filterValues);
        }
        return filterValues;
    }

    private void addFlexQueryConditions(
            Map<String, String> allParams,
            StringBuilder query,
            Map<String, Object> filterValues
    ) {
        allParams.keySet().forEach(key -> addFlexQueryCondition(key, allParams.get(key), query, filterValues));
    }

    private void addFlexQueryCondition(
            String key,
            String value,
            StringBuilder query,
            Map<String, Object> filterValues
    ) {
        query.append(" AND exists (select 1 from ListingAttributesEntity t2 where t2.listing.id = t1.id and t2.attributeName = '")
                .append(key).append("' and t2.attributeValue = :").append(key).append(") ");
        filterValues.put(key, value);
    }

    private void addFreshnessCondition(
            Map<String, String> allParams,
            StringBuilder query,
            Map<String, Object> filterValues
    ) {

        String freshness = allParams.get("freshness");

        // remove so flex query does not process it
        allParams.remove("freshness");

        if (freshness == null || freshness.isBlank()) {
            return;
        }

        OffsetDateTime filterTime = null;

        switch (freshness) {

            case "24h":
                filterTime = OffsetDateTime.now().minusHours(24);
                break;

            case "4d":
                filterTime = OffsetDateTime.now().minusDays(4);
                break;

            case "1w":
                filterTime = OffsetDateTime.now().minusWeeks(1);
                break;

            default:
                break;
        }

        if (filterTime != null) {
            query.append(" AND t1.createTime >= :filterTime ");
            filterValues.put("filterTime", filterTime);
        }
    }
}
