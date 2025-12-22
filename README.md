# Quantum Chess ♟️

**Quantum Chess** is a real-time multiplayer chess platform with a modern UI and live synchronization. Built for speed and interactivity, it allows players to compete online with instant move updates, game state validation, and persistent match data.

---

## 🚀 Features

- **Landing Page** – Clean introduction with quick access to play and matchmaking.
- **Real-Time Multiplayer** – Two players compete live with moves synced instantly using Supabase Realtime.
- **Matchmaking & Game Rooms** – Each game runs under a unique match ID, enabling direct URL-based access (`/match/:id`).
- **Chess Engine Integration** – Powered by `chess.js` for move validation, legal move generation, and game-end detection (checkmate, draw, stalemate).
- **Persistent Game State** – All moves are stored in the database, allowing reconnections and state recovery.
- **Responsive UI** – Smooth and minimal chessboard UI optimized for desktop and mobile.

---

## ⚙️ Tech Stack

- **Frontend:** [Vite](https://vitejs.dev/) + [React](https://react.dev/) + JavaScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend / Realtime:** [Supabase](https://supabase.com/) (PostgreSQL + Realtime subscriptions)
- **Chess Logic:** [`chess.js`](https://github.com/jhlywa/chess.js)

---

## 📊 Future Plans

- ⚛️ Add "quantum" mechanics (probabilistic or alternate-state moves)
- ♟️ Spectator mode for live games
- 🕒 Match timers and time controls
- 🏆 Player ratings and match history
- 💬 In-game chat per match

---
