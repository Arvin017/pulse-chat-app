package com.chatapp.repository;

import com.chatapp.model.Room;
import com.chatapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    @Query("SELECT r FROM Room r JOIN r.members m WHERE m = :user")
    List<Room> findRoomsByMember(User user);

    @Query("SELECT r FROM Room r WHERE r.type = 'PRIVATE' AND :user1 MEMBER OF r.members AND :user2 MEMBER OF r.members")
    Optional<Room> findPrivateRoom(User user1, User user2);
}
