package com.chatapp.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

// ===== AUTH DTOs =====
public class AuthDTO {

    @Data
    public static class RegisterRequest {
        @NotBlank private String username;
        @Email @NotBlank private String email;
        @NotBlank @Size(min = 6) private String password;
        private String displayName;
    }

    @Data
    public static class LoginRequest {
        @NotBlank private String username;
        @NotBlank private String password;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private UserDTO user;

        public AuthResponse(String token, UserDTO user) {
            this.token = token;
            this.user = user;
        }
    }
}
