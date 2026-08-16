package com.uv.bsol_backend.controller;

import com.uv.bsol_backend.service.ListingService;
import com.uv.bsol_backend.transformer.DataTransformer;
import com.uv.bsol_backend.transformer.DataTransformerFactory;
import com.uv.bsol_backend.enums.ListingType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("uv-api/v1/listings")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://10.169.144.244:3000"
})
@Slf4j
public class ListingController {
    @Autowired
    DataTransformerFactory dataTransformerFactory;

    @Autowired
    private ListingService listingService;

    // =========================
    // CREATE
    // =========================
    @PostMapping(
            value = "/{typeName}",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Object> createListingWithImages(
            @PathVariable String typeName,
            @RequestPart("listing") String body,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        log.info("Received request to create listing with images typeName: {}", typeName);
        DataTransformer<?, ?, ?> transformer = dataTransformerFactory.getTransformerFor(ListingType.fromValue(typeName), body);
        Object response = listingService.createListingWithImages(transformer, images);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // =========================
    // GET ALL
    // =========================
    @GetMapping(
            value = "/{typeName}",
            produces = {"application/json;charset=utf-8"}
    )
    public ResponseEntity<List<Object>> getListings(

            @PathVariable String typeName,
            @RequestParam(required = false) Map<String, String> allParams
    ) {
        log.info("Received request to get all listing of type {} with these parameters {}", typeName, allParams);
        DataTransformer<?, ?, ?> transformer = dataTransformerFactory.getTransformerFor(ListingType.fromValue(typeName), null);
        List<Object> listings = (List<Object>) listingService.getListingsByTypeAndFilters(transformer, allParams);
        return new ResponseEntity<>(listings, HttpStatus.OK);
    }

    // =========================
    // GET BY ID
    // =========================
    @GetMapping(
            value = "/{typeName}/{id}",
            produces = {"application/json;charset=utf-8"}
    )
    public ResponseEntity<Object> getListingById(
            @PathVariable String typeName,
            @PathVariable Long id
    ) {
        log.info("Received request to get listing by id: {} for type: {}", id, typeName);
        DataTransformer<?, ?, ?> transformer = dataTransformerFactory.getTransformerFor(ListingType.fromValue(typeName), null);
        Object listing = listingService.getListingById(id, transformer);
        return new ResponseEntity<>(listing, HttpStatus.OK);
    }

    // =========================
    // UPDATE
    // =========================
    @PutMapping(
            value = "/{typeName}/{id}",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Object> updateListingById(
            @PathVariable String typeName,
            @PathVariable Long id,
            @RequestPart("listing") String body,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        log.info("Received request to update listing id: {} for type: {}", id, typeName);
        DataTransformer<?, ?, ?> transformer = dataTransformerFactory.getTransformerFor(ListingType.fromValue(typeName), body);
        Object updated = listingService.updateListingById(id, transformer, images);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    // =========================
    // DELETE
    // =========================
    @DeleteMapping(value = "/{typeName}/{id}")
    public ResponseEntity<Void> deleteListingById(
            @PathVariable String typeName,
            @PathVariable Long id
    ) {
        log.info("Received request to soft-delete listing id: {} for type: {}", id, typeName);
        DataTransformer<?, ?, ?> transformer = dataTransformerFactory.getTransformerFor(ListingType.fromValue(typeName), null);
        listingService.deleteListingById(transformer, id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // =========================
    // HEALTH CHECK
    // =========================
    @GetMapping
    public String getListings() {
        return "Application is running";
    }
}
