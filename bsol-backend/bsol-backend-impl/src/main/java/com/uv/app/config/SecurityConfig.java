package com.uv.app.config;

import com.uv.app.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/health",
                                "/uv-api/v1/auth/register/request-otp",
                                "/uv-api/v1/auth/register/resend-otp",
                                "/uv-api/v1/auth/register",
                                "/uv-api/v1/auth/login",
                                "/uv-api/v1/auth/forgot-password",
                                "/uv-api/v1/auth/refresh",
                                "/uv-api/v1/auth/oauth2/authorization/**"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/listings",
                                "/listings/**"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/masters",
                                "/masters/**"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.POST,
                                "/masters/seed"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/listings/**"
                        ).hasAnyRole("USER", "ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/listings/**"
                        ).hasAnyRole("USER", "ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/listings/**"
                        ).hasAnyRole("USER", "ADMIN")

                        .requestMatchers("/auth/logout").authenticated()

                        .requestMatchers("/users/**").authenticated()

                        .anyRequest().authenticated()
                );

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(PasswordEncoder passwordEncoder) {

        DaoAuthenticationProvider authProvider =
                new DaoAuthenticationProvider(customUserDetailsService);

        authProvider.setPasswordEncoder(passwordEncoder);

        return new ProviderManager(authProvider);
    }
}