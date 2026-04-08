package com.skillbridge.service;

import com.skillbridge.dto.*;
import com.skillbridge.exception.BadRequestException;
import com.skillbridge.exception.ResourceNotFoundException;
import com.skillbridge.model.Role;
import com.skillbridge.model.User;
import com.skillbridge.repository.UserRepository;
import com.skillbridge.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.skillbridge.config.CustomUserDetailsService;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService customUserDetailsService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .bio(request.getBio())
                .build();
        userRepository.save(user);

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token).type("Bearer")
                .userId(user.getId()).name(user.getName())
                .email(user.getEmail()).role(user.getRole())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token).type("Bearer")
                .userId(user.getId()).name(user.getName())
                .email(user.getEmail()).role(user.getRole())
                .build();
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserResponse.from(user);
    }
}
