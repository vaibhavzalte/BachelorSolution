package com.uv.bsol_backend.controller;

import com.uv.bsol_backend.service.ListingService;
import com.uv.bsol_backend.transformer.DataTransformer;
import com.uv.bsol_backend.transformer.DataTransformerFactory;
import com.uv.bsol_backend.enums.ListingType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Listings", description = "Unified CRUD APIs for Room, Mess, RoomVacancy, FoodStall and StudyRoom")
public class ListingController {
    @Autowired
    DataTransformerFactory dataTransformerFactory;

    @Autowired
    private ListingService listingService;

    // =========================
    // CREATE
    // =========================
    @Operation(
            summary = "Create a listing",
            description = "Send multipart/form-data. The `listing` part must be a JSON string matching the request schema for typeName. Optional `images` files are stored and attached to the listing."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Listing created"),
            @ApiResponse(responseCode = "400", description = "Invalid listing type or payload")
    })
    @PostMapping(
            value = "/{typeName}",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Object> createListingWithImages(
            @Parameter(
                    description = "Listing type",
                    required = true,
                    schema = @Schema(allowableValues = {"Room", "Mess", "RoomVacancy", "FoodStall", "StudyRoom"})
            )
            @PathVariable String typeName,
            @Parameter(description = "JSON string of the listing request body", required = true)
            @RequestPart("listing") String body,
            @Parameter(description = "Optional listing images")
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
    @Operation(
            summary = "Get listings by type",
            description = "Returns active listings for the given type. Common query filters: city, subType, primaryId, freshness (24h, 4d, 1w). Extra query params are matched against listing_attributes, for example roomType, availableFor, foodType, mealType, preferredTenant, isOpen, isAvailable."
    )
    @ApiResponse(responseCode = "200", description = "List of listings")
    @GetMapping(
            value = "/{typeName}",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<List<Object>> getListings(

            @Parameter(
                    description = "Listing type",
                    required = true,
                    schema = @Schema(allowableValues = {"Room", "Mess", "RoomVacancy", "FoodStall", "StudyRoom"})
            )
            @PathVariable String typeName,
            @Parameter(hidden = true)
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
    @Operation(summary = "Get listing by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Listing found"),
            @ApiResponse(responseCode = "404", description = "Listing not found")
    })
    @GetMapping(
            value = "/{typeName}/{id}",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Object> getListingById(
            @Parameter(
                    description = "Listing type",
                    required = true,
                    schema = @Schema(allowableValues = {"Room", "Mess", "RoomVacancy", "FoodStall", "StudyRoom"})
            )
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
    @Operation(
            summary = "Update a listing",
            description = "Send multipart/form-data. The `listing` part must be a JSON string matching the request schema for typeName. Optional `images` replace stored images."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Listing updated"),
            @ApiResponse(responseCode = "404", description = "Listing not found")
    })
    @PutMapping(
            value = "/{typeName}/{id}",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Object> updateListingById(
            @Parameter(
                    description = "Listing type",
                    required = true,
                    schema = @Schema(allowableValues = {"Room", "Mess", "RoomVacancy", "FoodStall", "StudyRoom"})
            )
            @PathVariable String typeName,
            @PathVariable Long id,
            @Parameter(description = "JSON string of the listing request body", required = true)
            @RequestPart("listing") String body,
            @Parameter(description = "Optional listing images")
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
    @Operation(summary = "Soft-delete a listing")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Listing deleted"),
            @ApiResponse(responseCode = "404", description = "Listing not found")
    })
    @DeleteMapping(value = "/{typeName}/{id}")
    public ResponseEntity<Void> deleteListingById(
            @Parameter(
                    description = "Listing type",
                    required = true,
                    schema = @Schema(allowableValues = {"Room", "Mess", "RoomVacancy", "FoodStall", "StudyRoom"})
            )
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
    @Operation(summary = "API health check")
    @GetMapping
    public String getListings() {
        return "Application is running";
    }
}
