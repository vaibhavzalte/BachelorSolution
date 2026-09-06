package com.uv.app.service;

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
}
