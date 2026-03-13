import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

// ============ STYLES ============
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-0: #0d0d14;
    --bg-1: #13131f;
    --bg-2: #1a1a2e;
    --bg-3: #1e1e35;
    --border: rgba(255,255,255,0.06);
    --border-hover: rgba(255,255,255,0.12);
    --text-1: #f0f0fa;
    --text-2: #9898b8;
    --text-3: #5a5a78;
    --accent: #7c6af7;
    --accent-hover: #9585ff;
    --accent-glow: rgba(124,106,247,0.3);
    --green: #4ade80;
    --green-dim: rgba(74,222,128,0.15);
    --red: #f87171;
    --bubble-me: linear-gradient(135deg, #7c6af7, #a78bfa);
    --bubble-them: #1e1e35;
    --font: 'Plus Jakarta Sans', sans-serif;
    --mono: 'JetBrains Mono', monospace;
  }

  html, body, #root { height: 100%; font-family: var(--font); background: var(--bg-0); color: var(--text-1); }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--bg-3); border-radius: 4px; }

  .app { display: flex; height: 100vh; overflow: hidden; }

  /* AUTH */
  .auth-page {
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh; background: var(--bg-0);
    background-image: radial-gradient(ellipse at 20% 50%, rgba(124,106,247,0.08) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 20%, rgba(167,139,250,0.05) 0%, transparent 50%);
  }
  .auth-card {
    background: var(--bg-1); border: 1px solid var(--border);
    border-radius: 20px; padding: 48px 40px; width: 100%; max-width: 420px;
    box-shadow: 0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,106,247,0.1);
  }
  .auth-logo { font-size: 28px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.5px; }
  .auth-logo span { color: var(--accent); }
  .auth-sub { color: var(--text-2); font-size: 14px; margin-bottom: 32px; }
  .auth-tabs { display: flex; gap: 4px; background: var(--bg-2); border-radius: 10px; padding: 4px; margin-bottom: 28px; }
  .auth-tab {
    flex: 1; padding: 8px; border: none; border-radius: 8px; cursor: pointer;
    font-family: var(--font); font-size: 13px; font-weight: 600; transition: all 0.2s;
    background: transparent; color: var(--text-2);
  }
  .auth-tab.active { background: var(--accent); color: white; box-shadow: 0 4px 12px var(--accent-glow); }
  .input-group { margin-bottom: 16px; }
  .input-label { display: block; font-size: 12px; font-weight: 600; color: var(--text-2); margin-bottom: 6px; letter-spacing: 0.5px; text-transform: uppercase; }
  .input-field {
    width: 100%; padding: 12px 16px; background: var(--bg-2); border: 1px solid var(--border);
    border-radius: 10px; color: var(--text-1); font-family: var(--font); font-size: 14px;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .input-field:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
  .input-field::placeholder { color: var(--text-3); }
  .btn-primary {
    width: 100%; padding: 13px; background: var(--accent); border: none; border-radius: 10px;
    color: white; font-family: var(--font); font-size: 14px; font-weight: 600; cursor: pointer;
    transition: all 0.2s; margin-top: 8px;
  }
  .btn-primary:hover { background: var(--accent-hover); box-shadow: 0 8px 20px var(--accent-glow); transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  .error-msg { color: var(--red); font-size: 12px; margin-top: 8px; padding: 10px 12px; background: rgba(248,113,113,0.1); border-radius: 8px; }

  /* SIDEBAR */
  .sidebar {
    width: 300px; min-width: 300px; background: var(--bg-1); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; height: 100vh;
  }
  .sidebar-header {
    padding: 20px 20px 16px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .sidebar-title { font-size: 18px; font-weight: 700; letter-spacing: -0.3px; }
  .icon-btn {
    width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--border);
    background: var(--bg-2); color: var(--text-2); cursor: pointer; display: flex;
    align-items: center; justify-content: center; transition: all 0.2s; font-size: 16px;
  }
  .icon-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-glow); }
  .search-box { padding: 12px 16px; border-bottom: 1px solid var(--border); }
  .search-input {
    width: 100%; padding: 9px 14px 9px 36px; background: var(--bg-2); border: 1px solid var(--border);
    border-radius: 8px; color: var(--text-1); font-family: var(--font); font-size: 13px; outline: none;
    transition: border-color 0.2s;
  }
  .search-input:focus { border-color: var(--accent); }
  .search-wrap { position: relative; }
  .search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-3); font-size: 14px; }
  .rooms-list { flex: 1; overflow-y: auto; padding: 8px; }
  .room-item {
    padding: 12px; border-radius: 10px; cursor: pointer; transition: background 0.15s;
    display: flex; align-items: center; gap: 12px; margin-bottom: 2px;
  }
  .room-item:hover { background: var(--bg-2); }
  .room-item.active { background: var(--bg-3); }
  .room-avatar {
    width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center;
    justify-content: center; font-weight: 700; font-size: 16px; flex-shrink: 0;
    position: relative;
  }
  .online-dot {
    position: absolute; bottom: 0; right: 0; width: 11px; height: 11px;
    background: var(--green); border-radius: 50%; border: 2px solid var(--bg-1);
  }
  .room-info { flex: 1; min-width: 0; }
  .room-name { font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .room-preview { font-size: 12px; color: var(--text-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
  .room-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
  .room-time { font-size: 11px; color: var(--text-3); }
  .unread-badge {
    background: var(--accent); color: white; font-size: 10px; font-weight: 700;
    padding: 2px 6px; border-radius: 10px; min-width: 18px; text-align: center;
  }
  .sidebar-footer { padding: 16px; border-top: 1px solid var(--border); }
  .user-card { display: flex; align-items: center; gap: 10px; }
  .user-name-small { font-size: 13px; font-weight: 600; }
  .user-status { font-size: 11px; color: var(--green); display: flex; align-items: center; gap: 4px; }
  .logout-btn {
    margin-left: auto; padding: 6px 10px; background: transparent; border: 1px solid var(--border);
    border-radius: 6px; color: var(--text-2); font-size: 12px; cursor: pointer; transition: all 0.2s;
    font-family: var(--font);
  }
  .logout-btn:hover { border-color: var(--red); color: var(--red); }

  /* CHAT AREA */
  .chat-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .chat-header {
    padding: 0 24px; height: 65px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 14px; background: var(--bg-1); flex-shrink: 0;
  }
  .chat-header-info { flex: 1; }
  .chat-header-name { font-size: 16px; font-weight: 700; }
  .chat-header-status { font-size: 12px; color: var(--text-2); margin-top: 1px; }
  .messages-area { flex: 1; overflow-y: auto; padding: 20px 24px; display: flex; flex-direction: column; gap: 4px; }
  .date-divider {
    text-align: center; font-size: 11px; color: var(--text-3); padding: 8px 0;
    font-family: var(--mono); letter-spacing: 1px;
  }
  .message-row { display: flex; align-items: flex-end; gap: 8px; }
  .message-row.me { flex-direction: row-reverse; }
  .msg-avatar {
    width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center;
    justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0;
  }
  .bubble {
    max-width: 65%; padding: 10px 14px; border-radius: 16px; font-size: 14px; line-height: 1.5;
    word-break: break-word;
  }
  .bubble.them { background: var(--bubble-them); border-bottom-left-radius: 4px; color: var(--text-1); }
  .bubble.me { background: var(--bubble-me); border-bottom-right-radius: 4px; color: white; }
  .bubble-meta { font-size: 10px; color: var(--text-3); margin-top: 2px; }
  .message-row.me .bubble-meta { text-align: right; }
  .typing-indicator { display: flex; align-items: center; gap: 8px; padding: 8px 0; }
  .typing-dots { display: flex; gap: 4px; }
  .typing-dot {
    width: 6px; height: 6px; background: var(--text-3); border-radius: 50%;
    animation: typingBounce 1.4s infinite;
  }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typingBounce {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-6px); background: var(--accent); }
  }
  .typing-text { font-size: 12px; color: var(--text-3); }

  /* INPUT */
  .input-area {
    padding: 16px 24px; border-top: 1px solid var(--border); background: var(--bg-1);
    display: flex; align-items: flex-end; gap: 12px; flex-shrink: 0;
  }
  .message-input-wrap { flex: 1; background: var(--bg-2); border: 1px solid var(--border); border-radius: 14px; padding: 4px; transition: border-color 0.2s; }
  .message-input-wrap:focus-within { border-color: var(--accent); }
  .message-input {
    width: 100%; padding: 10px 14px; background: transparent; border: none; outline: none;
    color: var(--text-1); font-family: var(--font); font-size: 14px; resize: none; max-height: 120px;
    line-height: 1.5;
  }
  .message-input::placeholder { color: var(--text-3); }
  .send-btn {
    width: 42px; height: 42px; background: var(--accent); border: none; border-radius: 12px;
    color: white; cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; font-size: 18px; flex-shrink: 0;
  }
  .send-btn:hover { background: var(--accent-hover); box-shadow: 0 4px 12px var(--accent-glow); }
  .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* EMPTY STATE */
  .empty-state {
    flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 12px; color: var(--text-3);
  }
  .empty-icon { font-size: 48px; opacity: 0.5; }
  .empty-title { font-size: 18px; font-weight: 600; color: var(--text-2); }
  .empty-sub { font-size: 13px; }

  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex;
    align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(4px);
  }
  .modal {
    background: var(--bg-1); border: 1px solid var(--border); border-radius: 16px;
    padding: 28px; width: 400px; max-width: 90vw;
  }
  .modal-title { font-size: 18px; font-weight: 700; margin-bottom: 20px; }
  .modal-actions { display: flex; gap: 10px; margin-top: 20px; }
  .btn-secondary {
    flex: 1; padding: 10px; background: var(--bg-2); border: 1px solid var(--border);
    border-radius: 8px; color: var(--text-1); font-family: var(--font); font-size: 14px;
    cursor: pointer; transition: all 0.2s;
  }
  .btn-secondary:hover { border-color: var(--border-hover); }
  .user-result {
    display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 8px;
    cursor: pointer; transition: background 0.15s;
  }
  .user-result:hover { background: var(--bg-2); }
  .user-result-name { font-size: 14px; font-weight: 500; }
  .user-result-handle { font-size: 12px; color: var(--text-2); }
  .search-results { max-height: 200px; overflow-y: auto; margin-top: 8px; }

  /* ANIMATIONS */
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .message-row { animation: fadeIn 0.2s ease; }
  @keyframes slideIn { from { opacity: 0; transform: translateX(-16px); } to { opacity: 1; transform: translateX(0); } }
  .room-item { animation: slideIn 0.2s ease; }
`;

// ============ MOCK DATA & API ============
// NOTE: Replace these with real API calls to your Spring Boot backend

const API_BASE = "http://localhost:8080/api";
const WS_URL = "http://localhost:8080/ws";

// Mock in-memory store (replace with real API)
let mockUsers = [
    { id: 1, username: "arvin", displayName: "Arvin J", email: "arvin@email.com", avatarColor: "#7c6af7", isOnline: true },
    { id: 2, username: "priya", displayName: "Priya S", email: "priya@email.com", avatarColor: "#4ade80", isOnline: true },
    { id: 3, username: "rahul", displayName: "Rahul K", email: "rahul@email.com", avatarColor: "#f59e0b", isOnline: false },
    { id: 4, username: "neha", displayName: "Neha M", email: "neha@email.com", avatarColor: "#06b6d4", isOnline: true },
];

let mockRooms = [
    { id: 1, name: "Priya S", type: "PRIVATE", members: [mockUsers[0], mockUsers[1]], lastMessage: { content: "Hey! How's the project going?", sender: mockUsers[1], timestamp: new Date(Date.now() - 300000) }, unreadCount: 2 },
    { id: 2, name: "Dev Team 🚀", type: "GROUP", members: mockUsers, lastMessage: { content: "Sprint planning at 3pm", sender: mockUsers[2], timestamp: new Date(Date.now() - 3600000) }, unreadCount: 0 },
    { id: 3, name: "Neha M", type: "PRIVATE", members: [mockUsers[0], mockUsers[3]], lastMessage: { content: "Check the PR I raised", sender: mockUsers[3], timestamp: new Date(Date.now() - 86400000) }, unreadCount: 0 },
];

let mockMessages = {
    1: [
        { id: 1, content: "Hey Arvin! How's the Spring Boot project coming along?", sender: mockUsers[1], timestamp: new Date(Date.now() - 3600000), type: "CHAT" },
        { id: 2, content: "Going well! Just finished the WebSocket config 🔥", sender: mockUsers[0], timestamp: new Date(Date.now() - 3500000), type: "CHAT" },
        { id: 3, content: "Nice! Did you add STOMP support?", sender: mockUsers[1], timestamp: new Date(Date.now() - 3400000), type: "CHAT" },
        { id: 4, content: "Yeah, it's working perfectly. Messages are real-time now!", sender: mockUsers[0], timestamp: new Date(Date.now() - 3300000), type: "CHAT" },
        { id: 5, content: "Hey! How's the project going?", sender: mockUsers[1], timestamp: new Date(Date.now() - 300000), type: "CHAT" },
    ],
    2: [
        { id: 6, content: "Morning team! 👋", sender: mockUsers[1], timestamp: new Date(Date.now() - 7200000), type: "CHAT" },
        { id: 7, content: "Sprint planning at 3pm", sender: mockUsers[2], timestamp: new Date(Date.now() - 3600000), type: "CHAT" },
    ],
    3: [
        { id: 8, content: "Check the PR I raised", sender: mockUsers[3], timestamp: new Date(Date.now() - 86400000), type: "CHAT" },
    ]
};

// ============ UTILS ============
const getInitials = (name) => name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";

const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return "now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
};

const formatMsgTime = (date) => new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// ============ CONTEXT ============
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

// ============ COMPONENTS ============

function Avatar({ user, size = 42, showOnline = false }) {
    return (
        <div className="room-avatar" style={{ width: size, height: size, background: user?.avatarColor || "#7c6af7", color: "white", fontSize: size * 0.38 }}>
            {getInitials(user?.displayName || user?.username)}
            {showOnline && user?.isOnline && <div className="online-dot" />}
        </div>
    );
}

function NewChatModal({ onClose, onStartChat }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const search = (q) => {
        setQuery(q);
        if (q.length < 1) { setResults([]); return; }
        // Replace with: fetch(`${API_BASE}/users/search?q=${q}`)
        setResults(mockUsers.filter(u => u.username !== "arvin" &&
            (u.displayName.toLowerCase().includes(q.toLowerCase()) ||
                u.username.toLowerCase().includes(q.toLowerCase()))
        ));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-title">New Conversation</div>
                <input className="input-field" placeholder="Search users..." value={query} onChange={e => search(e.target.value)} autoFocus />
                <div className="search-results">
                    {results.map(user => (
                        <div key={user.id} className="user-result" onClick={() => onStartChat(user)}>
                            <Avatar user={user} size={36} showOnline />
                            <div>
                                <div className="user-result-name">{user.displayName}</div>
                                <div className="user-result-handle">@{user.username}</div>
                            </div>
                        </div>
                    ))}
                    {query && results.length === 0 && <div style={{ padding: "12px", color: "var(--text-3)", fontSize: 13 }}>No users found</div>}
                </div>
                <div className="modal-actions">
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

function Sidebar({ rooms, activeRoom, onSelectRoom, currentUser, onLogout, onNewChat }) {
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    const filtered = rooms.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

    const handleStartChat = (user) => {
        // Replace with: POST /api/rooms/private/{userId}
        const exists = rooms.find(r => r.type === "PRIVATE" && r.members?.some(m => m.id === user.id));
        if (exists) { onSelectRoom(exists); }
        else {
            const newRoom = { id: Date.now(), name: user.displayName, type: "PRIVATE", members: [currentUser, user], lastMessage: null, unreadCount: 0 };
            mockRooms.push(newRoom);
            mockMessages[newRoom.id] = [];
            onNewChat(newRoom);
        }
        setShowModal(false);
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-title">💬 Pulse</div>
                <button className="icon-btn" title="New Chat" onClick={() => setShowModal(true)}>✏️</button>
            </div>

            <div className="search-box">
                <div className="search-wrap">
                    <span className="search-icon">🔍</span>
                    <input className="search-input" placeholder="Search conversations..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            <div className="rooms-list">
                {filtered.map(room => (
                    <div key={room.id} className={`room-item ${activeRoom?.id === room.id ? "active" : ""}`} onClick={() => onSelectRoom(room)}>
                        <Avatar user={room.type === "PRIVATE" ? room.members?.find(m => m.id !== currentUser?.id) : { displayName: room.name, avatarColor: "#a78bfa" }} size={42} showOnline={room.type === "PRIVATE"} />
                        <div className="room-info">
                            <div className="room-name">{room.name}</div>
                            <div className="room-preview">{room.lastMessage ? `${room.type === "GROUP" ? room.lastMessage.sender?.displayName + ": " : ""}${room.lastMessage.content}` : "No messages yet"}</div>
                        </div>
                        <div className="room-meta">
                            <div className="room-time">{formatTime(room.lastMessage?.timestamp)}</div>
                            {room.unreadCount > 0 && <div className="unread-badge">{room.unreadCount}</div>}
                        </div>
                    </div>
                ))}
            </div>

            <div className="sidebar-footer">
                <div className="user-card">
                    <Avatar user={currentUser} size={36} />
                    <div>
                        <div className="user-name-small">{currentUser?.displayName}</div>
                        <div className="user-status">● Online</div>
                    </div>
                    <button className="logout-btn" onClick={onLogout}>Logout</button>
                </div>
            </div>

            {showModal && <NewChatModal onClose={() => setShowModal(false)} onStartChat={handleStartChat} />}
        </div>
    );
}

function ChatArea({ room, currentUser }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!room) return;
        // Replace with: fetch(`${API_BASE}/rooms/${room.id}/messages`)
        setMessages(mockMessages[room.id] || []);
        room.unreadCount = 0;
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }, [room]);

    const sendMessage = () => {
        if (!input.trim() || !room) return;
        const msg = {
            id: Date.now(),
            content: input.trim(),
            sender: currentUser,
            timestamp: new Date(),
            type: "CHAT"
        };
        // Replace with: stompClient.send(`/app/chat/${room.id}`, {}, JSON.stringify({content: input}))
        if (!mockMessages[room.id]) mockMessages[room.id] = [];
        mockMessages[room.id].push(msg);
        setMessages(prev => [...prev, msg]);
        room.lastMessage = msg;
        setInput("");
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    const handleTyping = () => {
        // Replace with: stompClient.send(`/app/typing/${room.id}`, {}, JSON.stringify({typing: true}))
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setTyping(null), 2000);
    };

    if (!room) {
        return (
            <div className="chat-area">
                <div className="empty-state">
                    <div className="empty-icon">💬</div>
                    <div className="empty-title">Welcome to Pulse</div>
                    <div className="empty-sub">Select a conversation or start a new one</div>
                </div>
            </div>
        );
    }

    const otherUser = room.type === "PRIVATE" ? room.members?.find(m => m.id !== currentUser?.id) : null;

    return (
        <div className="chat-area">
            <div className="chat-header">
                <Avatar user={otherUser || { displayName: room.name, avatarColor: "#a78bfa" }} size={40} showOnline={room.type === "PRIVATE"} />
                <div className="chat-header-info">
                    <div className="chat-header-name">{room.name}</div>
                    <div className="chat-header-status">
                        {room.type === "PRIVATE"
                            ? (otherUser?.isOnline ? "● Active now" : "Last seen recently")
                            : `${room.members?.length || 0} members`}
                    </div>
                </div>
            </div>

            <div className="messages-area">
                {messages.length === 0 && (
                    <div style={{ textAlign: "center", color: "var(--text-3)", fontSize: 13, marginTop: 40 }}>
                        No messages yet. Say hello! 👋
                    </div>
                )}
                {messages.map((msg, i) => {
                    const isMe = msg.sender?.id === currentUser?.id || msg.sender?.username === currentUser?.username;
                    const showDate = i === 0 || new Date(messages[i-1].timestamp).toDateString() !== new Date(msg.timestamp).toDateString();
                    return (
                        <div key={msg.id}>
                            {showDate && <div className="date-divider">{new Date(msg.timestamp).toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</div>}
                            <div className={`message-row ${isMe ? "me" : ""}`}>
                                {!isMe && <Avatar user={msg.sender} size={28} />}
                                <div>
                                    <div className={`bubble ${isMe ? "me" : "them"}`}>{msg.content}</div>
                                    <div className="bubble-meta">{formatMsgTime(msg.timestamp)}</div>
                                </div>
                                {isMe && <div style={{ width: 28 }} />}
                            </div>
                        </div>
                    );
                })}
                {typing && (
                    <div className="typing-indicator">
                        <div className="typing-dots">
                            <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                        </div>
                        <div className="typing-text">{typing} is typing...</div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
                <div className="message-input-wrap">
          <textarea
              ref={inputRef}
              className="message-input"
              placeholder="Type a message... (Enter to send)"
              value={input}
              onChange={e => { setInput(e.target.value); handleTyping(); }}
              onKeyDown={handleKeyDown}
              rows={1}
          />
                </div>
                <button className="send-btn" onClick={sendMessage} disabled={!input.trim()}>➤</button>
            </div>
        </div>
    );
}

function AuthPage({ onAuth }) {
    const [tab, setTab] = useState("login");
    const [form, setForm] = useState({ username: "", email: "", password: "", displayName: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setError(""); setLoading(true);
        try {
            // Replace with real API:
            // const res = await fetch(`${API_BASE}/auth/${tab}`, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(form) });
            // const data = await res.json();
            // if (!res.ok) throw new Error(data.message);
            // localStorage.setItem("token", data.token);
            // onAuth(data.user);

            // Mock auth:
            await new Promise(r => setTimeout(r, 600));
            if (!form.username || !form.password) throw new Error("Please fill all fields");
            const user = mockUsers.find(u => u.username === form.username) || mockUsers[0];
            onAuth(user);
        } catch (e) {
            setError(e.message);
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-logo">Pulse <span>Chat</span></div>
                <div className="auth-sub">Real-time messaging, beautifully simple</div>
                <div className="auth-tabs">
                    <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>Sign In</button>
                    <button className={`auth-tab ${tab === "register" ? "active" : ""}`} onClick={() => setTab("register")}>Register</button>
                </div>
                {tab === "register" && (
                    <div className="input-group">
                        <label className="input-label">Display Name</label>
                        <input className="input-field" placeholder="Your full name" value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} />
                    </div>
                )}
                <div className="input-group">
                    <label className="input-label">Username</label>
                    <input className="input-field" placeholder="Enter username" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
                </div>
                {tab === "register" && (
                    <div className="input-group">
                        <label className="input-label">Email</label>
                        <input className="input-field" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                )}
                <div className="input-group">
                    <label className="input-label">Password</label>
                    <input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
                </div>
                {error && <div className="error-msg">{error}</div>}
                <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? "Please wait..." : tab === "login" ? "Sign In →" : "Create Account →"}
                </button>
                <div style={{ marginTop: 16, fontSize: 12, color: "var(--text-3)", textAlign: "center" }}>
                    💡 Try username: <b style={{ color: "var(--accent)" }}>arvin</b> / password: <b style={{ color: "var(--accent)" }}>any</b>
                </div>
            </div>
        </div>
    );
}

// ============ APP ============
export default function App() {
    const [user, setUser] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [activeRoom, setActiveRoom] = useState(null);

    useEffect(() => {
        if (user) {
            // Replace with: fetch(`${API_BASE}/rooms`, { headers: { Authorization: `Bearer ${token}` } })
            setRooms([...mockRooms]);
        }
    }, [user]);

    const handleAuth = (authUser) => setUser(authUser);
    const handleLogout = () => { setUser(null); setRooms([]); setActiveRoom(null); };
    const handleSelectRoom = (room) => { setActiveRoom(room); room.unreadCount = 0; setRooms(r => [...r]); };
    const handleNewChat = (room) => { setRooms(r => [room, ...r]); setActiveRoom(room); };

    if (!user) return (
        <>
            <style>{styles}</style>
            <AuthPage onAuth={handleAuth} />
        </>
    );

    return (
        <>
            <style>{styles}</style>
            <div className="app">
                <Sidebar rooms={rooms} activeRoom={activeRoom} onSelectRoom={handleSelectRoom} currentUser={user} onLogout={handleLogout} onNewChat={handleNewChat} />
                <ChatArea room={activeRoom} currentUser={user} />
            </div>
        </>
    );
}
