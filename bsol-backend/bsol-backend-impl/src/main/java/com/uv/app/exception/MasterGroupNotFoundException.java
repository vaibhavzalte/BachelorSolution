package com.uv.app.exception;

public class MasterGroupNotFoundException extends RuntimeException {

    public MasterGroupNotFoundException(String groupCode) {
        super("Master group not found: " + groupCode);
    }
}
