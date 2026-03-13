package com.chatapp.controller;

import com.chatapp.dto.*;
import com.chatapp.model.Message;
import com.chatapp.service.ChatService;
import lombok.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    // ===== REST ENDPOINTS =====

    @GetMapping("/api/rooms")
    public ResponseEntity<List<RoomDTO>> getUserRooms(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(chatService.getUserRooms(userDetails.getUsername()));
    }

    @PostMapping("/api/rooms/private/{targetUserId}")
    public ResponseEntity<RoomDTO> createPrivateRoom(
            @PathVariable Long targetUserId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(chatService.createPrivateRoom(userDetails.getUsername(), targetUserId));
    }

    @PostMapping("/api/rooms/group")
    public ResponseEntity<RoomDTO> createGroupRoom(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        String name = (String) body.get("name");
        List<Long> memberIds = ((List<?>) body.get("memberIds"))
                .stream().map(id -> Long.valueOf(id.toString())).toList();
        return ResponseEntity.ok(chatService.createGroupRoom(userDetails.getUsername(), name, memberIds));
    }

    @GetMapping("/api/rooms/{roomId}/messages")
    public ResponseEntity<List<MessageDTO>> getMessages(@PathVariable Long roomId) {
        return ResponseEntity.ok(chatService.getRoomMessages(roomId));
    }

    @GetMapping("/api/users/search")
    public ResponseEntity<List<UserDTO>> searchUsers(
            @RequestParam String q,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(chatService.searchUsers(q, userDetails.getUsername()));
    }

    // ===== WEBSOCKET ENDPOINTS =====

    // Client sends to: /app/chat/{roomId}
    // Server broadcasts to: /topic/room/{roomId}
    @MessageMapping("/chat/{roomId}")
    public void sendMessage(@DestinationVariable Long roomId,
                            @Payload ChatMessage chatMessage,
                            @Header("simpUser") java.security.Principal principal) {
        MessageDTO saved = chatService.saveMessage(roomId, principal.getName(),
                chatMessage.getContent(), Message.MessageType.CHAT);
        messagingTemplate.convertAndSend("/topic/room/" + roomId, saved);
    }

    // Typing indicator: /app/typing/{roomId}
    @MessageMapping("/typing/{roomId}")
    public void typing(@DestinationVariable Long roomId,
                       @Payload Map<String, Object> payload,
                       @Header("simpUser") java.security.Principal principal) {
        payload.put("username", principal.getName());
        messagingTemplate.convertAndSend("/topic/typing/" + roomId, payload);
    }

    // ===== Inner DTO =====
    @Data
    public static class ChatMessage {
        private String content;
    }
}
