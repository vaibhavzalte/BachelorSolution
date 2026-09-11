package com.uv.app.service;

import com.uv.app.enums.OtpVerificationResult;
import com.uv.app.enums.security.AuthProvider;
import com.uv.app.exception.InvalidOtpException;
import com.uv.security.generated.app.model.LoginResponse;
import com.uv.security.generated.app.model.UserResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final EmailService emailService;
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;

    public String sendOtp(String email) {
        return emailService.sendOtpEmail(email);
    }

    public String verifyOtp(String email, String otp) {
        return emailService.verifyOtp(email, otp).getMessage();
    }

    public LoginResponse registerUser(String name, String email, String passwordHash, String otp) {
        // Verify OTP
        OtpVerificationResult otpVerificationResult = emailService.verifyOtp(email, otp);
        if (otpVerificationResult != OtpVerificationResult.OTP_VERIFIED) {
            throw new InvalidOtpException(otpVerificationResult.getMessage());
        }

        UserResponse userResponse = userService.createUser(name, email, passwordHash, AuthProvider.LOCAL);

        // For demonstration purposes, we'll return a dummy LoginResponse.
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setAccessToken(jwtService.generateToken(email));
        loginResponse.setUser(userResponse);
        return loginResponse;
    }

    @Transactional
    public LoginResponse login(String email, String password) {

        Authentication authenticate = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setAccessToken(jwtService.generateToken(authenticate.getName()));
        loginResponse.setUser(userService.findByEmail(email));
        return loginResponse;
    }
}
