package com.uv.app.controller;


import com.uv.app.service.AuthService;
import com.uv.security.generated.app.api.AuthApiController;
import com.uv.security.generated.app.model.*;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;

@Slf4j
@RestController
public class AuthController extends AuthApiController {

    private final AuthService authService;

    public AuthController(
            NativeWebRequest request,
            AuthService authService) {
        super(request);
        this.authService = authService;
    }

    @Override
    public ResponseEntity<MessageResponse> requestRegistrationOtp(
            @Valid RequestRegistrationOtpRequest request) {

        log.info("Registration OTP requested for email: {}", request.getEmail());
        String message = authService.sendOtp(request.getEmail());
        return ResponseEntity.ok(new MessageResponse(message));
    }

    @Override
    public ResponseEntity<MessageResponse> resendRegistrationOtp(
            @Valid RequestRegistrationOtpRequest request) {

        log.info("Resend OTP requested for email: {}", request.getEmail());
        String message = authService.sendOtp(request.getEmail());
        return ResponseEntity.ok(new MessageResponse(message));
    }

    @Override
    public ResponseEntity<LoginResponse> register(
            @Valid RegisterRequest request) {

        log.info("User registration request received for email: {}", request.getEmail());
        LoginResponse response = authService.registerUser(
                request.getName(),
                request.getEmail(),
                request.getPassword(),
                request.getOtp()
        );
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @Override
    public ResponseEntity<LoginResponse> login(LoginRequest loginRequest) {
        LoginResponse response = authService.login(
                loginRequest.getEmail(),
                loginRequest.getPassword());
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }
}