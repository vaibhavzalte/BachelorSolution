package com.uv.app.exception;

import com.uv.app.dto.response.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.OffsetDateTime;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ListingNotFoundException.class)
    public ResponseEntity<ErrorResponse> listingNotFound(ListingNotFoundException e) {

        log.error("Listing not found", e);

        return buildErrorResponse(
                HttpStatus.NOT_FOUND,
                e.getMessage(),
                "LISTING_NOT_FOUND"
        );
    }

    @ExceptionHandler(MasterGroupNotFoundException.class)
    public ResponseEntity<ErrorResponse> masterGroupNotFound(MasterGroupNotFoundException e) {
        log.error("Master group not found", e);

        return buildErrorResponse(
                HttpStatus.NOT_FOUND,
                e.getMessage(),
                "MASTER_GROUP_NOT_FOUND"
        );
    }

    @ExceptionHandler(DuplicateListingException.class)
    public ResponseEntity<ErrorResponse> duplicateListing(DuplicateListingException e) {
        log.error("Duplicate listing", e);

        return buildErrorResponse(
                HttpStatus.CONFLICT,
                e.getMessage(),
                "DUPLICATE_LISTING"
        );
    }

    @ExceptionHandler(FileStorageException.class)
    public ResponseEntity<ErrorResponse> handleFileStorage(FileStorageException e) {
        log.error("File storage failed", e);

        return buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                e.getMessage(),
                "FILE_STORAGE_ERROR"
        );
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequestException(BadRequestException e) {
        log.error("Bad request", e);

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                e.getMessage(),
                "BAD_REQUEST"
        );
    }

    @ExceptionHandler(InvalidOtpException.class)
    public ResponseEntity<ErrorResponse> handleInvalidOtp(InvalidOtpException e) {
        log.warn("Invalid OTP attempt");

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                e.getMessage(),
                "INVALID_OTP"
        );
    }

    private ResponseEntity<ErrorResponse> buildErrorResponse(
            HttpStatus status,
            String message,
            String code) {

        ErrorResponse error = new ErrorResponse(
                status.value(),
                message,
                code,
                OffsetDateTime.now()
        );

        return ResponseEntity
                .status(status)
                .body(error);
    }
}