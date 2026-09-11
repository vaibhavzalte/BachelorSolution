package com.uv.app.service;

import com.uv.app.entity.UserEntity;
import com.uv.app.enums.security.AuthProvider;
import com.uv.app.enums.security.Role;
import com.uv.app.repository.UsersRepository;
import com.uv.security.generated.app.model.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse createUser() {
        return null;
    }

    public UserResponse createUser(String name, String email, String password, AuthProvider authProvider) {
        UserEntity userEntity = UserEntity.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .authProvider(authProvider)
                .role(Role.USER)
                .build();

        UserEntity savedUser = usersRepository.save(userEntity);

        return convertToResponse(savedUser);
    }

    public UserResponse findByEmail(String email) {
        UserEntity user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email" + email));
        return convertToResponse(user);
    }

    private UserResponse convertToResponse(UserEntity userEntity) {
        UserResponse response = new UserResponse();
        response.setId(userEntity.getId());
        response.setName(userEntity.getName());
        response.setEmail(userEntity.getEmail());
        response.setProfileImageUrl(userEntity.getProfileImageUrl());
        response.setRole(userEntity.getRole().name());
        response.authProvider(userEntity.getAuthProvider().name());
        response.createdAt(userEntity.getCreatedAt());
        response.updatedAt(userEntity.getUpdatedAt());
        return response;
    }
}
