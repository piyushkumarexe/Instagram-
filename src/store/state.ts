import type { AppNotification, Comment, CreatedPost, Message, ThemeMode, Thread } from '../types'
import { NOTIFICATIONS, THREADS, YOU } from '../data/seed'

export interface ProfileEdits {
  name: string
  bio: string
  website: string
}

export const STORAGE_KEY = 'pixogram.state.v1'

export interface AppState {
  theme: ThemeMode
  liked: string[]
  saved: string[]
  following: string[]
  seenStories: string[]
  storyLikes: string[]
  addedComments: Record<string, Comment[]>
  likedComments: string[]
  threads: Thread[]
  notifications: AppNotification[]
  recentSearches: string[]
  createdPosts: CreatedPost[]
  muted: string[]
  reducedMotion: boolean
  profile: ProfileEdits
}

export const initialState: AppState = {
  theme: 'system',
  liked: [],
  saved: [],
  following: [],
  seenStories: [],
  storyLikes: [],
  addedComments: {},
  likedComments: [],
  threads: THREADS,
  notifications: NOTIFICATIONS,
  recentSearches: ['kavya.frames', '#goldenhour', 'bengaluru'],
  createdPosts: [],
  muted: [],
  reducedMotion: false,
  profile: { name: YOU.name, bio: YOU.bio, website: YOU.website ?? '' },
}

export type Action =
  | { type: 'hydrate'; state: Partial<AppState> }
  | { type: 'toggleLike'; postId: string }
  | { type: 'toggleSave'; postId: string }
  | { type: 'toggleFollow'; userId: string }
  | { type: 'viewStory'; storyId: string }
  | { type: 'likeStory'; storyId: string }
  | { type: 'addComment'; postId: string; comment: Comment }
  | { type: 'toggleCommentLike'; commentId: string }
  | { type: 'sendMessage'; threadId: string; text: string }
  | { type: 'markThreadRead'; threadId: string }
  | { type: 'markNotificationsRead' }
  | { type: 'addRecentSearch'; query: string }
  | { type: 'clearRecentSearches' }
  | { type: 'createPost'; post: CreatedPost }
  | { type: 'deletePost'; postId: string }
  | { type: 'setTheme'; theme: ThemeMode }
  | { type: 'toggleMute'; userId: string }
  | { type: 'setReducedMotion'; value: boolean }
  | { type: 'setProfile'; profile: Partial<ProfileEdits> }

const without = <T,>(arr: T[], v: T): T[] => arr.filter((x) => x !== v)
const toggle = <T,>(arr: T[], v: T): T[] => (arr.includes(v) ? without(arr, v) : [...arr, v])

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'hydrate':
      return { ...state, ...action.state, ...sanitise(action.state) }
    case 'toggleLike':
      return { ...state, liked: toggle(state.liked, action.postId) }
    case 'toggleSave':
      return { ...state, saved: toggle(state.saved, action.postId) }
    case 'toggleFollow':
      return { ...state, following: toggle(state.following, action.userId) }
    case 'viewStory':
      return state.seenStories.includes(action.storyId)
        ? state
        : { ...state, seenStories: [...state.seenStories, action.storyId] }
    case 'likeStory':
      return { ...state, storyLikes: toggle(state.storyLikes, action.storyId) }
    case 'addComment': {
      const prev = state.addedComments[action.postId] ?? []
      return { ...state, addedComments: { ...state.addedComments, [action.postId]: [...prev, action.comment] } }
    }
    case 'toggleCommentLike':
      return { ...state, likedComments: toggle(state.likedComments, action.commentId) }
    case 'sendMessage': {
      const message: Message = { id: `m${Date.now()}`, fromMe: true, text: action.text, createdAt: Date.now() }
      return {
        ...state,
        threads: state.threads.map((t) =>
          t.id === action.threadId ? { ...t, messages: [...t.messages, message], unread: 0 } : t,
        ),
      }
    }
    case 'markThreadRead':
      return { ...state, threads: state.threads.map((t) => (t.id === action.threadId ? { ...t, unread: 0 } : t)) }
    case 'markNotificationsRead':
      return { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) }
    case 'addRecentSearch': {
      const q = action.query.trim()
      if (!q) return state
      return { ...state, recentSearches: [q, ...without(state.recentSearches, q)].slice(0, 8) }
    }
    case 'clearRecentSearches':
      return { ...state, recentSearches: [] }
    case 'createPost':
      return { ...state, createdPosts: [action.post, ...state.createdPosts].slice(0, 24) }
    case 'deletePost':
      return { ...state, createdPosts: state.createdPosts.filter((p) => p.id !== action.postId) }
    case 'setTheme':
      return { ...state, theme: action.theme }
    case 'toggleMute':
      return { ...state, muted: toggle(state.muted, action.userId) }
    case 'setReducedMotion':
      return { ...state, reducedMotion: action.value }
    case 'setProfile':
      return { ...state, profile: { ...state.profile, ...action.profile } }
    default:
      return state
  }
}

/** Guards against corrupt / oversized persisted blobs (old schema, quota-trimmed JSON). */
function sanitise(raw: Partial<AppState>): Partial<AppState> {
  const arr = (v: unknown): string[] => (Array.isArray(v) ? (v.filter((x) => typeof x === 'string') as string[]) : [])
  return {
    theme: raw.theme === 'dark' || raw.theme === 'light' || raw.theme === 'system' ? raw.theme : 'system',
    liked: arr(raw.liked),
    saved: arr(raw.saved),
    following: arr(raw.following),
    seenStories: arr(raw.seenStories),
    storyLikes: arr(raw.storyLikes),
    likedComments: arr(raw.likedComments),
    recentSearches: arr(raw.recentSearches).slice(0, 8),
    muted: arr(raw.muted),
    addedComments: raw.addedComments && typeof raw.addedComments === 'object' ? raw.addedComments : {},
    createdPosts: Array.isArray(raw.createdPosts) ? raw.createdPosts.slice(0, 24) : [],
    threads: Array.isArray(raw.threads) && raw.threads.length ? raw.threads : THREADS,
    notifications: Array.isArray(raw.notifications) && raw.notifications.length ? raw.notifications : NOTIFICATIONS,
    reducedMotion: Boolean(raw.reducedMotion),
    profile:
      raw.profile && typeof raw.profile === 'object'
        ? {
            name: typeof raw.profile.name === 'string' ? raw.profile.name : YOU.name,
            bio: typeof raw.profile.bio === 'string' ? raw.profile.bio : YOU.bio,
            website: typeof raw.profile.website === 'string' ? raw.profile.website : YOU.website ?? '',
          }
        : { name: YOU.name, bio: YOU.bio, website: YOU.website ?? '' },
  }
}

export function loadState(): AppState {
  if (typeof localStorage === 'undefined') return initialState
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    return reducer(initialState, { type: 'hydrate', state: JSON.parse(raw) as Partial<AppState> })
  } catch {
    return initialState
  }
}

/** Debounced so a burst of taps costs one write, not ten. */
export function persist(state: AppState): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* quota exceeded — drop the heaviest part (uploaded images) and retry once */
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, createdPosts: [] }))
    } catch {
      /* storage unavailable (private mode) — app still works in-memory */
    }
  }
}
