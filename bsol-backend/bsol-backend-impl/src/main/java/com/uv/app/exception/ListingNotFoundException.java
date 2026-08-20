package com.uv.app.exception;

public class ListingNotFoundException extends RuntimeException {
    public ListingNotFoundException(String msg) {
        super(msg);
    }
}
