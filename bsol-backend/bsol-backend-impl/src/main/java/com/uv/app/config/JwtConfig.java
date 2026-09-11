package com.uv.app.config;

import io.jsonwebtoken.Jwts;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.crypto.SecretKey;

@Configuration
public class JwtConfig {

    @Bean
    public SecretKey jwtSecretKey() {
        return Jwts.SIG.HS256.key().build();
    }
}
