# 💬 Chatihna — Real-Time Messaging Platform

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4+-010101?logo=socket.io)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://vercel.com/)

**Chatihna** is a full-stack real-time messaging platform with audio/video calling, built for speed, simplicity, and scalability. Designed with a clean separation between frontend and backend, it covers the full communication pipeline — from secure authentication to peer-to-peer WebRTC calls.

---

## 🧠 Core Concept

The platform follows a real-world messaging pipeline:

1. **Auth** — Users authenticate via Firebase (Google or Email). A MongoDB profile is created on first login.
2. **Messaging** — Messages are persisted in MongoDB and delivered instantly via Socket.io.
3. **Media** — Images and voice messages are uploaded to Cloudinary before being saved.
4. **Read Receipts** — Seen/unseen status is tracked per message and synced in real time.
5. **Calling** — Audio/video calls are established P2P via WebRTC, with Socket.io as the signaling channel.

---

## 🏗️ Technical Architecture

### Backend (Node.js + Express + Socket.io)

Follows a **layered architecture** for clean separation of concerns:

- **Routes Layer** — RESTful endpoints for auth and chat operations.
- **Controllers Layer** — Business logic for users, messages, and conversations.
- **Middleware** — Firebase ID token verification on every protected route.
- **Models** — Three Mongoose schemas: `User`, `Chat`, `Message`.
- **Socket.io Server** — Handles real-time events and WebRTC signaling.

### Frontend (Next.js + React)

A **feature-based** architecture with a single orchestrating page:

- **Real-time Engine** — Socket.io client syncing messages, presence, and call events.
- **API Client** — Axios with automatic Firebase token injection and silent 401 refresh.
- **Component Library** — TailwindCSS-based responsive UI (mobile + desktop).
- **WebRTC** — Native `RTCPeerConnection` with Google STUN for P2P calls.

---

## 📊 Features Breakdown

| Module | Description |
| :--- | :--- |
| **Auth** | Firebase-based sign-in (Google / Email). Auto-creates MongoDB profile. |
| **Messaging** | Real-time text, image, and voice messages via Socket.io. |
| **Read Receipts** | Per-message seen/unseen status, synced across both clients. |
| **Calls** | P2P audio & video calling via WebRTC with ringtone support. |
| **Presence** | Live online/offline status with last seen timestamp. |
| **Search** | Full-text search across contacts and message history. |
| **Notifications** | Browser push notifications for background messages. |
| **Settings** | Update profile name and avatar (uploaded to Cloudinary). |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster
- A Firebase project (Authentication enabled)
- A Cloudinary account

### Environment Setup

**Backend** — create `chati-hna-backand/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/chatihna
FIREBASE_PROJECT_ID=your-firebase-project-id
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLIENT_URL=http://localhost:3000
PORT=5000
```

**Frontend** — create `chati-hna-frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Installation & Run

**Backend:**
```bash
cd chati-hna-backand
npm install
npm run dev
```

**Frontend:**
```bash
cd chati-hna-frontend
npm install
npm run dev
```

App is available at [http://localhost:3000](http://localhost:3000).

---

## 🗂️ Project Structure

```
chatty-main/
├── chati-hna-backand/
│   └── src/
│       ├── config/          # Cloudinary setup
│       ├── controllers/     # authController, chatController
│       ├── middlewares/     # Firebase token verification
│       ├── models/          # User, Chat, Message schemas
│       ├── routes/          # authRoutes, chatRoutes
│       └── index.js         # Express server + Socket.io
│
└── chati-hna-frontend/
    └── src/
        ├── app/             # Next.js pages (chat, login, register, settings)
        ├── components/      # ChatWindow, ChatList, CallModal, Sidebar…
        └── lib/             # api.js · socket.js · firebase.js
```

---

## 🔌 API Reference

All routes require `Authorization: Bearer <firebase_id_token>`.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/auth/me` | Get current user profile |
| `PUT` | `/api/auth/profile` | Update name / avatar |
| `GET` | `/api/chat/list` | List all conversations |
| `GET` | `/api/chat/messages/:chatId` | Fetch messages for a chat |
| `POST` | `/api/chat/send` | Send a text or voice message |
| `POST` | `/api/chat/mark-seen/:chatId` | Mark messages as read |
| `PUT` | `/api/chat/message/:id` | Edit a message |
| `DELETE` | `/api/chat/message/:id` | Delete a message |
| `DELETE` | `/api/chat/:id` | Delete a conversation |
| `GET` | `/api/chat/contacts` | List all users |
| `GET` | `/api/chat/search?query=` | Search contacts and messages |

---

## ⚡ Socket.io Events

| Event | Direction | Description |
| :--- | :--- | :--- |
| `receive_message` | Server → Client | Incoming new message |
| `messages_seen` | Server → Client | Messages marked as read |
| `user_status` | Server → Client | Presence change (online/offline) |
| `message_updated` | Server → Client | Message was edited |
| `message_deleted` | Server → Client | Message was deleted |
| `chat_deleted` | Server → Client | Conversation was deleted |
| `call-user` | Client → Server | Initiate a call (offer + type) |
| `answer-call` | Client → Server | Accept incoming call (answer) |
| `ice-candidate` | Bidirectional | WebRTC ICE negotiation |
| `end-call` | Client → Server | Hang up |

---

## 🗺️ Roadmap

- [x] Firebase authentication (Google + Email)
- [x] Real-time messaging (text, image, voice)
- [x] Read receipts & presence
- [x] Audio/video calling via WebRTC
- [x] Message edit & delete
- [x] Contact & message search
- [ ] **v2:** Group conversations
- [ ] **v2:** End-to-end encryption
- [ ] **v2:** Message reactions & threads
- [ ] **v2:** Mobile app (React Native)

---

## 🔐 Security Notice

This project is intended for **educational purposes** and personal use. Never deploy with default credentials. Ensure your Firebase, MongoDB, and Cloudinary secrets are kept out of version control.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes.
4. Push to the branch.
5. Open a Pull Request.

---

## 👨‍💻 Author

**Your Name**
- [GitHub](https://github.com/your-username)

⭐ *If this project was useful to you, consider giving it a star!*
