# Pixogram — an Instagram-style app

A front-end clone of Instagram built with **React 19 + TypeScript + Vite 8**. No backend: seed
data ships with the app and every action you take (likes, saves, follows, comments, DMs,
uploads, theme) is persisted to `localStorage`, so a reload keeps your state.

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 44 unit + integration tests (vitest + jsdom)
npm run build      # tsc --noEmit && vite build
npm run preview    # serve the production build
```

---

## ★ Hold the profile photo to zoom it

The interaction you asked for, implemented as a reusable hook
([`src/hooks/useLongPressZoom.ts`](src/hooks/useLongPressZoom.ts)) and component
([`src/components/ZoomablePhoto.tsx`](src/components/ZoomablePhoto.tsx)):

| Gesture | Behaviour |
| --- | --- |
| **Press & hold ~300 ms** | the photo springs out of its circle into a large centred preview over a blurred scrim, with a progress ring around the avatar while you hold |
| keep holding + **drag** | pans the enlarged photo |
| keep holding + **pinch** (or mouse wheel) | zooms 1× → 3×, clamped |
| **release** | the photo flies back into its circle and the overlay unmounts |
| **quick tap** | opens the same preview (what Instagram does on the web); story avatars override this so a tap plays the story instead |
| **Esc** / scroll behind / pointercancel | dismisses |
| **Enter / Space** | keyboard users get the same preview |

It is used on **your** profile photo, **every** other profile photo, every story-tray avatar
and every post-author avatar. The animation is transform/opacity only (compositor thread), so
the feed behind it never re-layouts — that is what keeps it at 60 fps on a phone. The geometry
is a FLIP: the overlay image is mounted at the avatar's own `getBoundingClientRect()` and then
scaled/translated to the preview anchor, so it genuinely looks like it grew out of the circle.

---

## Features

1. **Feed** — posts with header, location, timestamp, "Liked by … and N others", `more` / `#tag`
   linkification, "View all N comments", inline comment composer.
2. **Double-tap to like** — heart bursts over the photo, like button pops, state persists.
3. **Carousels** — swipeable multi-image posts with snap scrolling, dot indicator and a
   frame-throttled scroll handler.
4. **Stories** — tray bar with the gradient unseen ring, "Your story" add button, full-screen
   player with per-frame progress bars, 5 s auto-advance, tap left/right, swipe between trays,
   **hold to pause**, reply box, like + burst heart.
5. **Reels** — vertical snap feed, auto-play Ken Burns motion, progress bar, tap to pause,
   like / comment / share / save rail, follow button, audio marquee, mute toggle.
6. **Explore** — category chips (Travel/Food/Art/…) that filter the grid, masonry-style tall
   cells, hover overlay with like + comment counts.
7. **Post detail** — `/p/:id` opens the media + comments modal, nested replies, comment likes,
   quick-emoji composer, double-tap like, Esc/back to dismiss.
8. **Create post** — drag & drop or file picker, **client-side resize to 1080 px + webp** before
   it is stored, 12 Instagram filter presets with live thumbnails, caption + location, publishes
   straight into your feed and profile grid.
9. **Profile** — big hold-to-zoom photo, stats, bio/website, story highlights,
   Posts / Reels / Tagged tabs, private-account state, followers & following lists with follow
   buttons, **Edit profile** (name/bio/website) that persists.
10. **Direct messages** — inbox with unread pills and Primary/Unread filters, chat thread with
    bubbles, read state, heart message, typing indicator and a canned reply.
11. **Notifications** — likes / comments / follows / mentions / tags grouped into New, Today,
    This week, Earlier, with inline follow and post thumbnails; badge clears on open.
12. **Search** — debounced query, Top / Accounts / Tags / Places tabs, recent searches with
    clear-all, result lists and matching posts.
13. **Saved** — collection of everything you bookmarked, with an empty state.
14. **Follow / unfollow everywhere** — feed header, suggested rail, reels, notifications,
    profile, follower lists.
15. **Share sheet** — search people, quick-send with a toast, copy link.
16. **Dark / light / system theme** — real Instagram palettes as CSS custom properties,
    persisted, `<meta name="theme-color">` updated, respects `prefers-color-scheme`.
17. **Responsive shell** — desktop sidebar (icon-only under 1264 px), suggestions rail above
    1000 px, mobile top bar + bottom tab bar with unread dots.
18. **Toasts, modals & action sheets** — portal'd, Esc-to-close, scroll-locked, bottom-sheet
    style on mobile.
19. **PWA manifest + installable icons**, verified badges, online dots, relative timestamps,
    `prefers-reduced-motion` support.

## Performance work

- **Route-level code splitting** — every page is `React.lazy`, so the entry chunk is ~39 kB and
  each route is 1–9 kB (see `npm run build` output).
- **Stable vendor chunks** (`react`, `react-dom`, `router`) via `manualChunks` for long-lived
  caching; `assetsInlineLimit: 2048` kills tiny request round-trips.
- **Blur-up images** — every photo reserves its box from a known aspect ratio (no layout
  shift), paints a 20 px LQIP + dominant colour instantly, and only mounts the real `<img>`
  when an `IntersectionObserver` says it is near the viewport (`loading="lazy"` +
  `decoding="async"` on top).
- **`content-visibility: auto` + `contain-intrinsic-size`** on feed cards so off-screen posts
  skip layout and paint entirely.
- **Transform-only animation** for the zoom preview, heart burst, story progress and reel
  Ken Burns — nothing triggers layout or paint of the surrounding page.
- **rAF-throttled scroll handlers** (carousels, reels), **debounced search**, **debounced
  persistence** (one write per burst of taps) and memoised selectors that only recompute on the
  state slice they read.
- **Uploads are downscaled in the browser** to 1080 px webp before they hit `localStorage`,
  with a quota-exceeded fallback that drops uploads and retries.
- Inline SVG icon set (no icon font, no sprite request), inline critical CSS in `index.html` so
  the shell paints before the bundle lands.

## Project layout

```
public/media/          generated webp avatars + photos, LQIP manifest
scripts/build-media.mjs  media pipeline (slice contact sheets, encode webp, emit LQIPs)
src/
  App.tsx              providers + router + global overlays (stories, share, menu)
  components/          Avatar, ZoomablePhoto, PostCard, StoryViewer, Shell, Modal, Toast, …
  hooks/               useLongPressZoom, useInView, useMediaQuery, useSwipe, useDebouncedValue
  lib/                 posts (merge/tokenize), stories (grouping), image (upload resize)
  pages/               Feed, Explore, Reels, Profile, PostDetail, Messages, Notifications,
                       Saved, CreatePost, SearchPage, Settings
  store/               reducer + localStorage persistence, React context
  data/seed.ts         demo users, posts, stories, threads, notifications
```

## Regenerating the demo media

`npm run media` reads `media-src/*.png` (18 portraits as two 3×3 contact sheets + 8 photos),
slices and encodes them into `public/media/`, computes each image's dominant colour and a 20 px
base64 LQIP, generates six procedural SVG "art" posts, and rewrites
`src/data/media.generated.ts`. Everything runs offline with `sharp`.

## Tests

```
npm test
```

- `StoryViewer.test.tsx` — tray playback, seen-marking, next/previous, closing at the ends,
  replies, plus `groupStories` ordering.
- `useLongPressZoom.test.tsx` — hold threshold, preview geometry, tap-to-open, `onTap` hand-off,
  scroll-drift cancel, release → close → unmount, Esc, pointercancel, pan, wheel-zoom clamping,
  keyboard open.
- `ZoomablePhoto.test.tsx` — the real component: press-and-hold shows the overlay with the
  enlarged photo and `@username`, releasing unmounts it, drifting cancels.
- `state.test.ts` — reducer transitions, `mergePost` folding, caption tokenising, upload → post,
  localStorage round-trip, corrupt-blob recovery, quota-exceeded retry.
- `App.test.tsx` — mounts the whole app (providers, router, lazy feed) and exercises like, save
  and persistence end to end.

## Notes

Demo build: no network calls, no accounts. Instagram is a trademark of Meta; this is an
independent front-end study, not affiliated with or endorsed by Instagram.
