package com.chatapp.dto;

import com.chatapp.model.Message;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageDTO {
    private Long id;
    private String content;
    private LocalDateTime timestamp;
    private UserDTO sender;
    private Long roomId;
    private boolean isRead;
    private Message.MessageType type;
}
