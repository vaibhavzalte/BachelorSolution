package com.uv.bsol_backend.exception;

public class ListingNotFoundException extends RuntimeException{
    public ListingNotFoundException(String msg){
        super(msg);
    }
}
