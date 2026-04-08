package com.skillbridge.dto;

import com.skillbridge.model.Role;
import com.skillbridge.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String bio;
    private String profilePicture;
    private LocalDateTime createdAt;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .bio(user.getBio())
                .profilePicture(user.getProfilePicture())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
