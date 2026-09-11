package com.uv.app.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Encoders;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class JWTService {


    //  The key is regenerated every application restart.
    public final SecretKey key;

    public String generateToken(String email) {

        System.out.println(
                "JWT Secret (Base64)URL: " +
                        Encoders.BASE64URL.encode(key.getEncoded())
        );

        Instant issuedAt = Instant.now();
        return Jwts.builder()
                .subject(email)
                .issuedAt(Date.from(issuedAt))
                .expiration(Date.from(issuedAt.plusSeconds(15 * 60)))
                .signWith(key)
                .compact();
    }
}
