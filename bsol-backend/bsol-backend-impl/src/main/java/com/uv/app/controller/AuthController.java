package com.uv.app.controller;


import com.uv.app.service.AuthService;
import com.uv.security.generated.app.api.AuthApiController;
import com.uv.security.generated.app.model.MessageResponse;
import com.uv.security.generated.app.model.RequestRegistrationOtpRequest;
import com.uv.security.generated.app.model.VerifyRegistrationOtpRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;

@Slf4j
@RestController
public class AuthController extends AuthApiController {
    private final AuthService authService;

    public AuthController(NativeWebRequest request, AuthService authService) {
        super(request);
        this.authService = authService;
    }

    @Override
    public ResponseEntity<MessageResponse> requestRegistrationOtp(RequestRegistrationOtpRequest requestRegistrationOtpRequest) {
        log.info("Registration OTP requested for email: {}", requestRegistrationOtpRequest.getEmail());

        String message = authService.sendOtp(
                requestRegistrationOtpRequest.getEmail()
        );
        return ResponseEntity.ok(new MessageResponse(message));
    }

    @Override
    public ResponseEntity<MessageResponse> resendRegistrationOtp(RequestRegistrationOtpRequest requestRegistrationOtpRequest) {
        log.info("Resend OTP requested for email: {}", requestRegistrationOtpRequest.getEmail());
        String message = authService.sendOtp(
                requestRegistrationOtpRequest.getEmail()
        );
        return ResponseEntity.ok(new MessageResponse(message));
    }

    @Override
    public ResponseEntity<MessageResponse> verifyRegistrationOtp(VerifyRegistrationOtpRequest verifyRegistrationOtpRequest) {
        log.info("Verify OTP requested for email: {}", verifyRegistrationOtpRequest.getEmail());
        String message = authService.verifyOtp(
                verifyRegistrationOtpRequest.getEmail(), verifyRegistrationOtpRequest.getOtp()
        );
        return ResponseEntity.ok(new MessageResponse(message));
    }

}
