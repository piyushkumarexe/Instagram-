# VibeGram 📸✨

An Instagram-style full-stack social app — built from scratch with **React + Vite** on the front and **Express + Node** on the back, using a tiny JSON database (zero external DB setup needed).

> Demo login → **username:** `demo` · **password:** `demo123`

## ✨ Features

| Area | What works |
|---|---|
| 🔐 Auth | Signup, login, JWT sessions, one-tap **demo login** |
| 📰 Feed | Instagram-style feed, infinite scroll, follow-only visibility, "all caught up" state |
| 📝 Posts | Photo/video upload with **10 filters** (Clarendon, Moon, Juno…), captions, delete |
| ❤️ Engagement | Like (**double-tap heart animation**), comments (add/delete), save/bookmark, share via link |
| 📖 Stories | 24-hour stories with gradient rings, seen state, full-screen viewer with progress bars, auto-advance, replies via DM |
| 🧭 Explore | Grid explore page, live search (users + captions) |
| 🎬 Reels | Vertical snap-scroll reels — real videos play; image reels get a ken-burns effect |
| 💬 DMs | Direct messages with chats, bubbles, day separators, emoji picker, unread badges, polling |
| 🔔 Notifications | Likes / comments / follows with unread badge and thumbnails |
| 👤 Profile | Avatar, bio, edit profile, posts/reels/saved tabs, followers/following modals, follow/unfollow |
| 📱 UI | Pixel-faithful Instagram layout — desktop sidebar + right rail, full mobile app experience with bottom nav |
| 🎨 Branding | Custom **VibeGram** gradient logo, avatars & demo content generated for a lived-in feel |

## 🚀 Run it

```bash
npm install
npm run seed        # loads demo users, posts, stories, DMs
npm run dev         # starts API (3001) + web app (5173)
```

Open http://localhost:5173 — log in with the demo account or create your own.

## 📱 Android APK (built by GitHub Actions)

The repo ships with a **Capacitor**-wrapped Android app. Every push triggers [`.github/workflows/android.yml`](.github/workflows/android.yml), which builds `app-debug.apk` and uploads it as a run artifact named **`VibeGram-APK`** (pushing a tag like `v1.0` also attaches it to a GitHub Release).

**Get the APK:** Repo → **Actions** → latest *Android APK* run → download **VibeGram-APK** → install (allow "unknown apps").

The APK bundles the web app itself; it connects to a VibeGram **server you run**:
1. Start the backend anywhere on the same network: `npm install && npm run seed && npm run dev`
2. Find your PC's IP (`ipconfig` / `ifconfig`), e.g. `192.168.1.5`
3. In the app's login screen enter the **Server URL** → `http://192.168.1.5:3001` (Android emulator: `http://10.0.2.2:3001`)
4. Log in (e.g. `demo` / `demo123`) — feed, stories, reels, DMs all work

> HTTPS note: for a publicly deployed backend (Render/Railway/etc.) just paste its `https://…` URL.

Build locally instead: `npm run android:build` → `android/app/build/outputs/apk/debug/app-debug.apk`

## 🗂 Structure

```
server/          Express API (auth, posts, stories, DMs, notifications…)
  store.js       JSON-file DB
  seed.js        Demo data seeder (node server/seed.js --force to reseed)
  uploads/       Media storage (gitignored)
client/          React app (Vite)
  src/pages      Home, Explore, Reels, Messages, Notifications, Profile, Login
  src/components PostCard, StoryBar/Viewer, CreateModal, PostModal, Sidebar…
seeds/           Generated avatars & post images used by the seeder
```

## 🧪 Tech notes

- Auth: JWT (30d) + bcrypt password hashing
- Uploads: multer (images + video, 40 MB cap), served statically
- Real-time-ish: lightweight polling for DMs & notification badges
- Image filters are baked client-side via `<canvas>` before upload

---
*VibeGram is a demo project for educational purposes — not affiliated with Instagram/Meta.*
