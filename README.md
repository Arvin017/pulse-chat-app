# 💬 Pulse Chat — Real-Time Chat App
> Spring Boot + WebSocket + STOMP + React | Full Stack Project

---

## 🎯 What This Project Covers (For Interviews)
- JWT Authentication (Spring Security)
- WebSocket + STOMP (Real-time messaging)
- JPA/Hibernate (Database relations)
- REST APIs (Room & message management)
- React Frontend (Hooks, Context, State)

---

## 🛠️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3.2, Spring Security, JWT |
| Real-time | WebSocket + STOMP Protocol |
| Database | MySQL + JPA/Hibernate |
| Frontend | React.js + Tailwind CSS |
| Build | Maven |

---

## 🚀 How to Run

### Backend
```bash
# 1. Create MySQL database
mysql -u root -p
CREATE DATABASE chatapp_db;

# 2. Update credentials in application.properties
spring.datasource.username=root
spring.datasource.password=yourpassword

# 3. Run Spring Boot
cd backend
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm start
# Opens at http://localhost:3000
```

---

## 📁 Project Structure
```
chat-app/
├── backend/                    ← Spring Boot
│   └── src/main/java/com/chatapp/
│       ├── config/
│       │   ├── WebSocketConfig.java   ← STOMP setup
│       │   └── SecurityConfig.java    ← JWT config
│       ├── controller/
│       │   ├── AuthController.java    ← /api/auth/*
│       │   └── ChatController.java    ← WebSocket + REST
│       ├── model/              ← User, Room, Message
│       ├── repository/         ← JPA Repositories
│       ├── service/            ← Business logic
│       ├── security/           ← JwtUtil, JwtFilter
│       └── dto/                ← Request/Response objects
│
└── frontend/                   ← React App
    └── src/
        └── App.jsx             ← Complete UI
```

---

## 🗄️ Database Schema
```
users       → id, username, email, password, display_name, avatar_color, is_online, last_seen
rooms       → id, name, type (PRIVATE/GROUP), created_at
room_members→ room_id, user_id (junction table)
messages    → id, content, timestamp, sender_id, room_id, is_read, type
```

---

## 🔌 API Endpoints
```
POST /api/auth/register         → Register new user
POST /api/auth/login            → Login, returns JWT token
GET  /api/rooms                 → Get user's rooms
POST /api/rooms/private/{id}    → Create private chat
POST /api/rooms/group           → Create group chat
GET  /api/rooms/{id}/messages   → Get message history
GET  /api/users/search?q=       → Search users
```

## 🔌 WebSocket Endpoints
```
/ws                             → WebSocket connection (SockJS)
/app/chat/{roomId}              → Send message to room
/app/typing/{roomId}            → Send typing indicator
/topic/room/{roomId}            → Subscribe for messages
/topic/typing/{roomId}          → Subscribe for typing
```

---

## 💬 Interview Answer
> "I built a full-stack real-time chat application using Spring Boot with WebSocket and STOMP protocol for instant messaging, JWT-based authentication with Spring Security, JPA/Hibernate for message persistence in MySQL, and a React frontend — fully containerized with Docker."

---

## 🚢 Deployment
```bash
# Build Docker image
docker build -t pulse-chat-backend ./backend

# Run
docker run -p 8080:8080 pulse-chat-backend

# Frontend → Deploy on Vercel
vercel deploy ./frontend
```
