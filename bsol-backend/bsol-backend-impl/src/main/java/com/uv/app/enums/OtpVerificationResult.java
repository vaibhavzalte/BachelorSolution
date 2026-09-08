package com.uv.app.enums;

public enum OtpVerificationResult {

    OTP_VERIFIED("OTP verified successfully."),
    OTP_NOT_FOUND("OTP not found. Please request a new OTP."),
    OTP_EXPIRED("OTP has expired. Please request a new OTP."),
    OTP_INVALID("Invalid OTP. Please enter the correct OTP.");

    private final String message;

    OtpVerificationResult(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}