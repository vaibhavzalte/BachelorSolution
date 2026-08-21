package com.uv.app.controller;

import com.uv.app.enums.ListingType;
import com.uv.app.service.ListingService;
import com.uv.app.transformer.DataTransformer;
import com.uv.app.transformer.DataTransformerFactory;
import com.uv.generated.app.api.ListingsApiController;
import com.uv.generated.app.model.ListingResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://10.169.144.244:3000"
})
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
                ListingType.fromValue(typeName),
                listing
        );
        ListingResponse response = (ListingResponse) listingService.createListingWithImages(transformer, images);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<List<ListingResponse>> getListings(
            String typeName,
            @Nullable Map<String, String> allParams
    ) {
        Map<String, String> filterParams = allParams != null ? allParams : Collections.emptyMap();
        log.info("Received request to get listings of type {} with parameters {}", typeName, filterParams);
        DataTransformer<?, ?, ?> transformer = dataTransformerFactory.getTransformerFor(ListingType.fromValue(typeName));
        List<ListingResponse> listings = (List<ListingResponse>) listingService.getListingsByTypeAndFilters(
                transformer,
                filterParams
        );
        return new ResponseEntity<>(listings, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<ListingResponse> getListingById(String typeName, Long id) {
        log.info("Received request to get listing by id: {} for type: {}", id, typeName);
        DataTransformer<?, ?, ?> transformer = dataTransformerFactory.getTransformerFor(ListingType.fromValue(typeName));
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
                ListingType.fromValue(typeName),
                listing
        );
        ListingResponse updated = (ListingResponse) listingService.updateListingById(id, transformer, images);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Void> deleteListing(String typeName, Long id) {
        log.info("Received request to soft-delete listing id: {} for type: {}", id, typeName);
        DataTransformer<?, ?, ?> transformer = dataTransformerFactory.getTransformerFor(ListingType.fromValue(typeName));
        listingService.deleteListingById(transformer, id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Override
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Application is running");
    }
}
