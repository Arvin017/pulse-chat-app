package com.chatapp.service;

import com.chatapp.dto.*;
import com.chatapp.model.*;
import com.chatapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageRepository messageRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final AuthService authService;

    // ===== ROOM OPERATIONS =====

    @Transactional
    public RoomDTO createPrivateRoom(String currentUsername, Long targetUserId) {
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        // Check if private room already exists
        Optional<Room> existing = roomRepository.findPrivateRoom(currentUser, targetUser);
        if (existing.isPresent()) return toRoomDTO(existing.get(), currentUser);

        Room room = Room.builder()
                .name(targetUser.getDisplayName())
                .type(Room.RoomType.PRIVATE)
                .members(new HashSet<>(Set.of(currentUser, targetUser)))
                .build();

        return toRoomDTO(roomRepository.save(room), currentUser);
    }

    @Transactional
    public RoomDTO createGroupRoom(String currentUsername, String roomName, List<Long> memberIds) {
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Set<User> members = new HashSet<>();
        members.add(currentUser);
        memberIds.forEach(id -> userRepository.findById(id).ifPresent(members::add));

        Room room = Room.builder()
                .name(roomName)
                .type(Room.RoomType.GROUP)
                .members(members)
                .build();

        return toRoomDTO(roomRepository.save(room), currentUser);
    }

    public List<RoomDTO> getUserRooms(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return roomRepository.findRoomsByMember(user)
                .stream()
                .map(r -> toRoomDTO(r, user))
                .collect(Collectors.toList());
    }

    // ===== MESSAGE OPERATIONS =====

    @Transactional
    public MessageDTO saveMessage(Long roomId, String senderUsername, String content, Message.MessageType type) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        User sender = userRepository.findByUsername(senderUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Message message = Message.builder()
                .content(content)
                .sender(sender)
                .room(room)
                .type(type)
                .timestamp(LocalDateTime.now())
                .build();

        return toMessageDTO(messageRepository.save(message));
    }

    public List<MessageDTO> getRoomMessages(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        return messageRepository.findByRoomOrderByTimestampAsc(room)
                .stream()
                .map(this::toMessageDTO)
                .collect(Collectors.toList());
    }

    // ===== USERS =====

    public List<UserDTO> searchUsers(String query, String currentUsername) {
        return userRepository.findByUsernameContainingIgnoreCase(query)
                .stream()
                .filter(u -> !u.getUsername().equals(currentUsername))
                .map(authService::toDTO)
                .collect(Collectors.toList());
    }

    public void setUserOnlineStatus(String username, boolean online) {
        userRepository.findByUsername(username).ifPresent(user -> {
            user.setOnline(online);
            if (!online) user.setLastSeen(LocalDateTime.now());
            userRepository.save(user);
        });
    }

    // ===== CONVERTERS =====

    public MessageDTO toMessageDTO(Message msg) {
        return MessageDTO.builder()
                .id(msg.getId())
                .content(msg.getContent())
                .timestamp(msg.getTimestamp())
                .sender(authService.toDTO(msg.getSender()))
                .roomId(msg.getRoom().getId())
                .isRead(msg.isRead())
                .type(msg.getType())
                .build();
    }

    public RoomDTO toRoomDTO(Room room, User currentUser) {
        List<Message> msgs = messageRepository.findByRoomOrderByTimestampDesc(room, PageRequest.of(0, 1));
        MessageDTO lastMsg = msgs.isEmpty() ? null : toMessageDTO(msgs.get(0));
        long unread = messageRepository.countByRoomAndIsReadFalseAndSenderIdNot(room, currentUser.getId());

        return RoomDTO.builder()
                .id(room.getId())
                .name(room.getType() == Room.RoomType.PRIVATE
                    ? room.getMembers().stream()
                        .filter(m -> !m.getId().equals(currentUser.getId()))
                        .findFirst().map(User::getDisplayName).orElse(room.getName())
                    : room.getName())
                .type(room.getType())
                .members(room.getMembers().stream().map(authService::toDTO).collect(Collectors.toSet()))
                .createdAt(room.getCreatedAt())
                .lastMessage(lastMsg)
                .unreadCount((int) unread)
                .build();
    }
}
