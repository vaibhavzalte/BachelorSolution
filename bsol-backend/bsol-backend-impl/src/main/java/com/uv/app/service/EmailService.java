package com.uv.app.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final Map<String, OtpDetails> otpStore = new ConcurrentHashMap<>();
    @Value("${app.otp.expiry-minutes}")
    private Integer otpExpiryMinutes;
    @Value("${app.otp.length}")
    private int otpLength;

    public String sendOtpEmail(String to) {

        String otp = generateOtp();

        LocalDateTime expiryTime =
                LocalDateTime.now().plusMinutes(otpExpiryMinutes);

        otpStore.put(to, new OtpDetails(otp, expiryTime));

        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("Your Bachelor Solution OTP 🔐");
            helper.setText(buildOtpEmail(otp), true);

            mailSender.send(message);

            log.info("OTP email sent successfully to {}", to);

            return "OTP sent on email " + to;

        } catch (MessagingException e) {

            otpStore.remove(to);

            log.error("Failed to send OTP email to {}", to, e);

            throw new RuntimeException(
                    "Unable to send OTP email. Please try again later."
            );
        }
    }

    private String buildOtpEmail(String otp) {

        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport"
                          content="width=device-width, initial-scale=1.0">
                
                    <title>Bachelor Solution OTP</title>
                </head>
                
                <body style="
                    margin: 0;
                    padding: 0;
                    background-color: #f4f6f8;
                    font-family: Arial, Helvetica, sans-serif;
                    color: #1f2937;
                ">
                
                    <table width="100%%"
                           cellpadding="0"
                           cellspacing="0"
                           border="0"
                           style="background-color: #f4f6f8; padding: 40px 15px;">
                
                        <tr>
                            <td align="center">
                
                                <!-- Main Card -->
                                <table width="100%%"
                                       cellpadding="0"
                                       cellspacing="0"
                                       border="0"
                                       style="
                                           max-width: 520px;
                                           background-color: #ffffff;
                                           border-radius: 16px;
                                           overflow: hidden;
                                           box-shadow: 0 8px 30px rgba(0,0,0,0.08);
                                       ">
                
                                    <!-- Header -->
                                    <tr>
                                        <td style="
                                            padding: 32px 35px;
                                            text-align: center;
                                            background-color: #111827;
                                        ">
                
                                            <div style="
                                                font-size: 26px;
                                                font-weight: 700;
                                                color: #ffffff;
                                                letter-spacing: -0.5px;
                                            ">
                                                Bachelor Solution
                                            </div>
                
                                            <div style="
                                                margin-top: 8px;
                                                font-size: 13px;
                                                color: #9ca3af;
                                            ">
                                                Smart living. Simple solutions.
                                            </div>
                
                                        </td>
                                    </tr>
                
                                    <!-- Content -->
                                    <tr>
                                        <td style="padding: 40px 35px;">
                
                                            <div style="
                                                text-align: center;
                                                font-size: 28px;
                                                font-weight: 700;
                                                color: #111827;
                                                margin-bottom: 12px;
                                            ">
                                                Verify your email 🔐
                                            </div>
                
                                            <div style="
                                                text-align: center;
                                                font-size: 15px;
                                                line-height: 24px;
                                                color: #6b7280;
                                                margin-bottom: 30px;
                                            ">
                                                You're almost in! Use the OTP below
                                                to complete your registration.
                                            </div>
                
                                            <!-- OTP Box -->
                                            <div style="
                                                background-color: #f3f4f6;
                                                border: 1px solid #e5e7eb;
                                                border-radius: 14px;
                                                padding: 24px;
                                                text-align: center;
                                                margin-bottom: 25px;
                                            ">
                
                                                <div style="
                                                    font-size: 12px;
                                                    font-weight: 600;
                                                    text-transform: uppercase;
                                                    letter-spacing: 2px;
                                                    color: #6b7280;
                                                    margin-bottom: 12px;
                                                ">
                                                    Your OTP
                                                </div>
                
                                                <div style="
                                                    font-size: 36px;
                                                    font-weight: 700;
                                                    letter-spacing: 8px;
                                                    color: #111827;
                                                ">
                                                    %s
                                                </div>
                
                                            </div>
                
                                            <!-- Expiry -->
                                            <div style="
                                                text-align: center;
                                                font-size: 14px;
                                                color: #6b7280;
                                                margin-bottom: 30px;
                                            ">
                                                This code expires in
                                                <strong style="color: #111827;">
                                                    %d minutes
                                                </strong>.
                                            </div>
                
                                            <!-- Security Note -->
                                            <div style="
                                                background-color: #fff7ed;
                                                border-left: 4px solid #f97316;
                                                border-radius: 8px;
                                                padding: 14px 16px;
                                                font-size: 13px;
                                                line-height: 20px;
                                                color: #7c2d12;
                                            ">
                                                <strong>Quick heads-up:</strong><br>
                                                Never share this OTP with anyone.
                                                Bachelor Solution will never ask
                                                you for your OTP.
                                            </div>
                
                                            <div style="
                                                text-align: center;
                                                margin-top: 30px;
                                                font-size: 14px;
                                                color: #6b7280;
                                            ">
                                                Didn't request this?
                                                You can safely ignore this email.
                                            </div>
                
                                        </td>
                                    </tr>
                
                                    <!-- Footer -->
                                    <tr>
                                        <td style="
                                            padding: 24px 35px;
                                            text-align: center;
                                            background-color: #f9fafb;
                                            border-top: 1px solid #e5e7eb;
                                        ">
                
                                            <div style="
                                                font-size: 13px;
                                                color: #9ca3af;
                                                line-height: 20px;
                                            ">
                                                © Bachelor Solution
                                            </div>
                
                                            <div style="
                                                margin-top: 5px;
                                                font-size: 12px;
                                                color: #9ca3af;
                                            ">
                                                Built for better living.
                                            </div>
                
                                        </td>
                                    </tr>
                
                                </table>
                
                            </td>
                        </tr>
                
                    </table>
                
                </body>
                </html>
                """.formatted(otp, otpExpiryMinutes);
    }

    private String generateOtp() {

        SecureRandom secureRandom = new SecureRandom();

        int min = (int) Math.pow(10, otpLength - 1);
        int max = (int) Math.pow(10, otpLength);

        return String.valueOf(
                secureRandom.nextInt(max - min) + min
        );
    }

    public String verifyOtp(String email, String otp) {

        OtpDetails otpDetails = otpStore.get(email);

        if (otpDetails == null) {
            return "OTP not found. Please request a new OTP.";
        }

        if (LocalDateTime.now().isAfter(otpDetails.expiryTime())) {

            otpStore.remove(email);

            return "OTP has expired. Please request a new OTP.";
        }

        if (!otpDetails.otp().equals(otp)) {
            return "Invalid OTP. Please enter the correct OTP.";
        }

        otpStore.remove(email);

        return "OTP verified successfully.";
    }

    private record OtpDetails(
            String otp,
            LocalDateTime expiryTime
    ) {
    }
}