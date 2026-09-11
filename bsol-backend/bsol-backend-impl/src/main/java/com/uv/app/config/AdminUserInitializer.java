package com.uv.app.config;

import com.uv.app.entity.UserEntity;
import com.uv.app.enums.security.AuthProvider;
import com.uv.app.enums.security.Role;
import com.uv.app.enums.security.UserStatus;
import com.uv.app.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminUserInitializer implements ApplicationRunner {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.name}")
    private String adminName;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    public void run(ApplicationArguments args) {
        usersRepository.findByEmail(adminEmail)
                .ifPresentOrElse(
                        user -> {
                            if (user.getRole() != Role.ADMIN) {
                                user.setRole(Role.ADMIN);
                                usersRepository.save(user);
                            }
                        },
                        () -> {
                            UserEntity admin = UserEntity.builder()
                                    .name(adminName)
                                    .email(adminEmail)
                                    .password(passwordEncoder.encode(adminPassword))
                                    .role(Role.ADMIN)
                                    .authProvider(AuthProvider.LOCAL)
                                    .emailVerified(true)
                                    .status(UserStatus.ACTIVE)
                                    .build();

                            usersRepository.save(admin);
                        }
                );
    }
}