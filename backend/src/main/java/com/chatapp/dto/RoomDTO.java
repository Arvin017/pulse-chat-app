package com.chatapp.dto;

import com.chatapp.model.Room;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomDTO {
    private Long id;
    private String name;
    private Room.RoomType type;
    private Set<UserDTO> members;
    private LocalDateTime createdAt;
    private MessageDTO lastMessage;
    private int unreadCount;
}
