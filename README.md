# Instagram 2.0 📸✨

> **Renamed from VibeGram.** Same app, same Firebase backend, same `com.vibegram.app`
> package id (kept so Google sign-in and the existing Firestore data keep working) —
> only the display name, wordmark and launcher icon changed.

## What's new in v7.0

- **Hold the profile photo to zoom it** (Instagram's signature gesture) — new
  `ProfileZoom.kt`: FLIP animation from the avatar's real on-screen rect, drag to pan,
  pinch to zoom, lift-the-finger to close. Wired into the profile header, the story
  tray, every post header and the bottom-nav avatar.
- **"Liked by" sheet** — it was dead code (nothing ever opened it and the list was never
  loaded). Now tapping a like count resolves the likers via `Fb.likersOf()`.
- **Story seen rings actually turn grey** — `StoryBar` read a `seen_*` preference that
  was never written; the story viewer writes it now.
- **Back button no longer shows a blank screen** — it navigated to a `"home"` tab that
  does not exist.
- **Long-press a story to pause** it.
- Post like counts use the compact `43.6K` format like the rest of the app.
- Bitmap cache is now sized by **bytes** (1/6 of heap) instead of a flat 60 entries, so
  large images can no longer get the process killed; remote images crossfade in.

A full Instagram-style social app — **100% serverless, powered by Google Firebase**. Works as a web app, an **Android APK**, and an **iOS IPA** — all built automatically by GitHub Actions.

> Download: **[Releases](../../releases)** → `app-debug.apk` (Android) · `Instagram2-iOS-unsigned.ipa` (iOS)

## ✨ Features

| Area | What works |
|---|---|
| 🔐 Auth | **Google Sign-In**, email/password signup+login, unique-username onboarding |
| 📰 Feed | Realtime Firestore feed, infinite scroll, follow-only visibility, "all caught up" state |
| 📝 Posts | Photo/video upload to **Firebase Storage**, 10 filters, captions, delete |
| ❤️ Engagement | Likes (double-tap heart), comments, save/bookmark, share links, transactional like-counts |
| 📖 Stories | 24-hour stories, gradient rings, full-screen viewer, auto-advance, replies via DM |
| 🧭 Explore | Grid explore, live **username search** (Firestore index-free prefix queries) + caption search |
| 🎬 Reels | Snap-scroll reels with ken-burns effect for image reels |
| 💬 DMs | **Realtime chat** (Firestore snapshots), bubbles, day separators, emoji picker, unread badges |
| 🔔 Notifications | **Realtime** likes/comments/follows with unread badge + thumbnails |
| 👤 Profiles | Posts/reels/saved tabs, followers/following lists, edit profile, avatar upload, live counters |
| 🔍 **Hold to zoom** | **Press & hold any profile photo — it grows out of its circle into a full-screen preview; drag to pan, pinch to zoom 1×–4×, lift to close** |
| 👍 Likes sheet | Tap a like count to see exactly who liked the post |
| ⏸️ Story pause | Long-press anywhere in the story viewer to pause playback (and the music) |
| 📱 Apps | Android APK (Capacitor) + iOS IPA (unsigned) + instant web preview |

## 🔥 Firebase architecture (v2.0)

- **Auth** — Google provider + Email/Password
- **Firestore** — `users`, `usernames` (uniqueness via transaction), `posts` (+`comments` subcollection), `stories`, `follows`, `dms/{pair}/messages`, `notifications`
- **Storage** — `uploads/` and `stories/` and `avatars/`
- Zero composite indexes needed (denormalized counters + client-side sorting) — works on any fresh Firebase project
- Starter content **self-seeds** into an empty project on first login (5 creators, posts, reels, stories, chats) — media served from this repo's raw GitHub URLs

### One-time Firebase settings that unlock everything
| Feature | Console setting |
|---|---|
| Google sign-in on **web preview** | Authentication → Settings → **Authorized domains** → add the preview domain |
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
*Instagram 2.0 is a demo project for educational purposes — not affiliated with Instagram/Meta.*
