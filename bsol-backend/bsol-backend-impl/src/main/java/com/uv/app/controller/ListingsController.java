package com.uv.app.controller;

import com.uv.generated.app.api.ListingsApiController;
import com.uv.generated.app.model.ListingFormListing;
import com.uv.generated.app.model.ListingResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
public class ListingsController extends ListingsApiController {
    public ListingsController(NativeWebRequest request) {
        super(request);
    }

    @GetMapping("hello")
    public String hello() {
        return "Hello World!";
    }

    @Override
    public ResponseEntity<ListingResponse> createListing(String typeName, ListingFormListing listing, List<MultipartFile> images) {
        return super.createListing(typeName, listing, images);
    }
}
