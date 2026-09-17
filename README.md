# VibeGram 📸✨

A full Instagram-style social app — **100% serverless, powered by Google Firebase**. Works as a web app, an **Android APK**, and an **iOS IPA** — all built automatically by GitHub Actions.

> Download: **[Releases](../../releases)** → `app-debug.apk` (Android) · `VibeGram-iOS-unsigned.ipa` (iOS)

## ✨ Features

| Area | What works |
|---|---|
| 🔐 Auth | **Google Sign-In**, email/password signup+login, one-tap **demo login**, unique-username onboarding |
| 📰 Feed | Realtime Firestore feed, infinite scroll, follow-only visibility, "all caught up" state |
| 📝 Posts | Photo/video upload to **Firebase Storage**, 10 filters, captions, delete |
| ❤️ Engagement | Likes (double-tap heart), comments, save/bookmark, share links, transactional like-counts |
| 📖 Stories | 24-hour stories, gradient rings, full-screen viewer, auto-advance, replies via DM |
| 🧭 Explore | Grid explore, live **username search** (Firestore index-free prefix queries) + caption search |
| 🎬 Reels | Snap-scroll reels with ken-burns effect for image reels |
| 💬 DMs | **Realtime chat** (Firestore snapshots), bubbles, day separators, emoji picker, unread badges |
| 🔔 Notifications | **Realtime** likes/comments/follows with unread badge + thumbnails |
| 👤 Profiles | Posts/reels/saved tabs, followers/following lists, edit profile, avatar upload, live counters |
| 📱 Apps | Android APK (Capacitor) + iOS IPA (unsigned) + instant web preview |

## 🔥 Firebase architecture (v2.0)

- **Auth** — Google provider + Email/Password
- **Firestore** — `users`, `usernames` (uniqueness via transaction), `posts` (+`comments` subcollection), `stories`, `follows`, `dms/{pair}/messages`, `notifications`
- **Storage** — `uploads/` and `stories/` and `avatars/`
- Zero composite indexes needed (denormalized counters + client-side sorting) — works on any fresh Firebase project
- Demo content **self-seeds** into an empty project on first login (5 demo creators, posts, reels, stories, chats) — media served from this repo's raw GitHub URLs

### One-time Firebase settings that unlock everything
| Feature | Console setting |
|---|---|
| Google sign-in on **web preview** | Authentication → Settings → **Authorized domains** → add the preview domain |
| Demo / email login | Authentication → Sign-in method → enable **Email/Password** |
| Keep data writable | Firestore/Storage rules in **test mode** work out of the box (expire ~30 days — extend the date to keep writing) |

## 🚀 Run / build

```bash
npm install
npm run dev         # web app (Firebase is the backend — nothing else to run)
npm run android:build   # Android APK  → android/app/build/outputs/apk/debug/app-debug.apk
```

Push to GitHub → Actions build **APK + IPA** automatically; `v*` tags attach them to Releases.

## 🍎 iOS note

Apple requires signing ($99/yr dev account) to install on iPhones. The workflow produces an **unsigned IPA** — open `ios/` in Xcode with your team to sign, or sideload with AltStore/Sideloadly.

---
*VibeGram is a demo project for educational purposes — not affiliated with Instagram/Meta.*
