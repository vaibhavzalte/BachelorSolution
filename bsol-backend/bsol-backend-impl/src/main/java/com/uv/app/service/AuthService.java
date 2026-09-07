package com.uv.app.service;

import com.uv.security.generated.app.model.LoginResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class AuthService {
    private final EmailService emailService;

    public String sendOtp(String email) {
        return emailService.sendOtpEmail(email);
    }

    public String verifyOtp(String email, String otp) {
        return emailService.verifyOtp(email, otp);
    }

    public LoginResponse registerUser(String name, String email, String password, String otp) {

        // Verify OTP
        String verificationResult = emailService.verifyOtp(email, otp);
        if (!"OTP verified successfully.".equals(verificationResult)) {
            throw new IllegalArgumentException("Invalid OTP");
        }

        // Here you would typically save the user to the database and generate a JWT token.
        // For demonstration purposes, we'll return a dummy LoginResponse.
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setAccessToken("dummy-jwt-token");
        loginResponse.setUser(new com.uv.security.generated.app.model.UserResponse()
                .name(name)
                .email(email));

        return loginResponse;
    }
}
