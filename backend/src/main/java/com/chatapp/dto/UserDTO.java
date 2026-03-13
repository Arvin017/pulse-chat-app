package com.chatapp.dto;

import com.chatapp.model.Message;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String displayName;
    private String avatarColor;
    private boolean isOnline;
    private LocalDateTime lastSeen;
}
