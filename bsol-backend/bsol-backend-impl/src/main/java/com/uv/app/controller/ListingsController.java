package com.uv.app.controller;

import com.uv.app.enums.ListingType;
import com.uv.app.exception.BadRequestException;
import com.uv.app.service.ListingService;
import com.uv.app.transformer.DataTransformer;
import com.uv.app.transformer.DataTransformerFactory;
import com.uv.generated.app.api.ListingsApiController;
import com.uv.generated.app.model.ListingQueryParams;
import com.uv.generated.app.model.ListingResponse;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
public class ListingsController extends ListingsApiController {

    private final ListingService listingService;
    private final DataTransformerFactory dataTransformerFactory;

    public ListingsController(
            NativeWebRequest request,
            ListingService listingService,
            DataTransformerFactory dataTransformerFactory
    ) {
        super(request);
        this.listingService = listingService;
        this.dataTransformerFactory = dataTransformerFactory;
    }

    @Override
    public ResponseEntity<ListingResponse> createListing(
            String typeName,
            String listing,
            List<MultipartFile> images
    ) {
        log.info("Received request to create listing typeName: {}", typeName);
        DataTransformer<?, ?, ?> transformer = dataTransformerFactory.getTransformerFor(
                resolveListingType(typeName),
                listing
        );
        ListingResponse response = (ListingResponse) listingService.createListingWithImages(transformer, images);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<List<ListingResponse>> getListings(
            String typeName,
            @ParameterObject @ModelAttribute ListingQueryParams listingQueryParams
    ) {
        Map<String, String> allParams = buildFilterParams(listingQueryParams);
        log.info("Received request to get listings of type {} with parameters {}", typeName, allParams);
        DataTransformer<?, ?, ?> transformer = dataTransformerFactory.getTransformerFor(resolveListingType(typeName));
        List<ListingResponse> listings = (List<ListingResponse>) listingService.getListingsByTypeAndFilters(
                transformer,
                allParams
        );
        return new ResponseEntity<>(listings, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<ListingResponse> getListingById(String typeName, Long id) {
        log.info("Received request to get listing by id: {} for type: {}", id, typeName);
        DataTransformer<?, ?, ?> transformer = dataTransformerFactory.getTransformerFor(resolveListingType(typeName));
        ListingResponse listing = (ListingResponse) listingService.getListingById(id, transformer);
        return new ResponseEntity<>(listing, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<ListingResponse> updateListing(
            String typeName,
            Long id,
            String listing,
            List<MultipartFile> images
    ) {
        log.info("Received request to update listing id: {} for type: {}", id, typeName);
        DataTransformer<?, ?, ?> transformer = dataTransformerFactory.getTransformerFor(
                resolveListingType(typeName),
                listing
        );
        ListingResponse updated = (ListingResponse) listingService.updateListingById(id, transformer, images);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Void> deleteListing(String typeName, Long id) {
        log.info("Received request to soft-delete listing id: {} for type: {}", id, typeName);
        DataTransformer<?, ?, ?> transformer = dataTransformerFactory.getTransformerFor(resolveListingType(typeName));
        listingService.deleteListingById(transformer, id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Override
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Application is running");
    }

    private ListingType resolveListingType(String typeName) {
        try {
            return ListingType.fromValue(typeName);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid Listing Type " + typeName);
        }
    }

    private Map<String, String> buildFilterParams(ListingQueryParams listingQueryParams) {
        Map<String, String> allParams = new HashMap<>();
        if (listingQueryParams == null) {
            return allParams;
        }
        putIfPresent(allParams, "city", listingQueryParams.getCity());
        putIfPresent(allParams, "subType", listingQueryParams.getSubType());
        putIfPresent(allParams, "primaryId", listingQueryParams.getPrimaryId());
        putIfPresent(
                allParams,
                "freshness",
                listingQueryParams.getFreshness() == null ? null : listingQueryParams.getFreshness().getValue()
        );
        putIfPresent(allParams, "roomType", listingQueryParams.getRoomType());
        putIfPresent(allParams, "availableFor", listingQueryParams.getAvailableFor());
        putIfPresent(allParams, "foodType", listingQueryParams.getFoodType());
        putIfPresent(allParams, "mealType", listingQueryParams.getMealType());
        putIfPresent(allParams, "preferredTenant", listingQueryParams.getPreferredTenant());
        putIfPresent(allParams, "isOpen", listingQueryParams.getIsOpen());
        putIfPresent(allParams, "isAvailable", listingQueryParams.getIsAvailable());
        putIfPresent(allParams, "hasWifi", listingQueryParams.getHasWifi());
        putIfPresent(allParams, "hasAC", listingQueryParams.getHasAC());
        putIfPresent(allParams, "homeDelivery", listingQueryParams.getHomeDelivery());
        return allParams;
    }

    private void putIfPresent(Map<String, String> params, String key, String value) {
        if (value != null && !value.isEmpty()) {
            params.put(key, value);
        }
    }
}
