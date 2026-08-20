package com.uv.app.exception;

import com.uv.generated.app.model.ErrorResponse;
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
        ErrorResponse error = new ErrorResponse()
                .status(HttpStatus.NOT_FOUND.value())
                .message(e.getMessage())
                .timestamp(OffsetDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DuplicateListingException.class)
    public ResponseEntity<ErrorResponse> duplicateListing(DuplicateListingException e) {
        log.error("Duplicate listing", e);
        ErrorResponse error = new ErrorResponse()
                .status(HttpStatus.CONFLICT.value())
                .message(e.getMessage())
                .timestamp(OffsetDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(FileStorageException.class)
    public ResponseEntity<ErrorResponse> handleFileStorage(FileStorageException e) {
        log.error("File storage failed", e);
        ErrorResponse error = new ErrorResponse()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message(e.getMessage())
                .timestamp(OffsetDateTime.now());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<String> handleBadRequestException(BadRequestException e) {
        log.error("Bad request while processing listing", e);
        return new ResponseEntity<>(
                "Error occurred while processing listing data, bad request",
                HttpStatus.BAD_REQUEST
        );
    }
}
