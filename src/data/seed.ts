import { AVATARS, POST_MEDIA } from './media.generated'
import type { AppNotification, Comment, MediaAsset, Post, Story, Thread, User } from '../types'

const MIN = 60_000
const HOUR = 60 * MIN
const DAY = 24 * HOUR
const now = Date.now()

/** Deterministic pick so the demo feed looks the same on every reload. */
const pick = <T,>(arr: T[], i: number): T => arr[i % arr.length]
const media = (i: number): MediaAsset => {
  const m = pick(POST_MEDIA, i)
  return { src: m.src, width: m.width, height: m.height, ratio: m.ratio, lqip: m.lqip, color: m.color }
}

interface UserSeed {
  username: string
  name: string
  verified?: boolean
  bio: string
  website?: string
  followers: number
  following: number
  postsCount: number
  isFollowing?: boolean
  online?: boolean
  isPrivate?: boolean
}

const USER_SEEDS: UserSeed[] = [
  { username: 'aarav.codes', name: 'Aarav Sharma', bio: 'Building things for the web ⚡\nDelhi → Bengaluru', website: 'aarav.dev', followers: 1284, following: 342, postsCount: 27, isFollowing: false, online: true },
  { username: 'mira.travels', name: 'Mira Nair', verified: true, bio: '32 countries and counting 🌍\nSlow travel, fast coffee', website: 'miraontheroad.com', followers: 184_300, following: 218, postsCount: 412, isFollowing: true, online: true },
  { username: 'devendra.eats', name: 'Devendra Rathore', bio: 'Street food first, questions later 🍜', followers: 9_842, following: 501, postsCount: 188, isFollowing: true },
  { username: 'kavya.frames', name: 'Kavya Iyer', verified: true, bio: 'Photographer. Golden hour chaser 📷', followers: 221_900, following: 96, postsCount: 634, isFollowing: true, online: true },
  { username: 'rohit.rides', name: 'Rohit Verma', bio: 'Bikes, roads, mountains 🔁', followers: 4_410, following: 388, postsCount: 71, isFollowing: false },
  { username: 'ananya.art', name: 'Ananya Bose', bio: 'Oil on canvas, mostly at 2am 🎨', followers: 33_120, following: 143, postsCount: 259, isFollowing: true },
  { username: 'sameer.lifts', name: 'Sameer Khan', bio: 'Strength coach • 5am club', followers: 15_600, following: 267, postsCount: 320 },
  { username: 'naina.stitches', name: 'Naina Kapoor', bio: 'Slow fashion, handloom only 🧵', followers: 7_905, following: 412, postsCount: 96, isFollowing: true },
  { username: 'arjun.waves', name: 'Arjun Menon', verified: true, bio: 'Surf • Salt • Sunrise', followers: 98_400, following: 77, postsCount: 187, isFollowing: true },
  { username: 'priya.bakes', name: 'Priya Desai', bio: 'Sourdough experiments 🍞', followers: 22_340, following: 189, postsCount: 401 },
  { username: 'vikram.trails', name: 'Vikram Singh', bio: 'Himalayan trails & tent life ⛺', followers: 12_780, following: 233, postsCount: 154, isFollowing: true },
  { username: 'isha.reads', name: 'Isha Malhotra', bio: 'One book a week 📚', followers: 3_204, following: 511, postsCount: 63 },
  { username: 'kabir.beats', name: 'Kabir Joshi', verified: true, bio: 'Producer / DJ 🎧', followers: 310_500, following: 64, postsCount: 88, isFollowing: true },
  { username: 'tara.grows', name: 'Tara Fernandes', bio: 'Urban jungle, 148 plants 🌿', followers: 18_990, following: 302, postsCount: 214, isFollowing: true },
  { username: 'manav.builds', name: 'Manav Gupta', bio: 'Carpentry + coffee ☕️', followers: 6_410, following: 274, postsCount: 118 },
  { username: 'zoya.styles', name: 'Zoya Sheikh', bio: 'Stylist. Thrift > new.', followers: 45_800, following: 198, postsCount: 377, isFollowing: true },
  { username: 'farhan.clips', name: 'Farhan Ali', bio: 'Filmmaker, one frame at a time 🎬', followers: 27_600, following: 155, postsCount: 143 },
  { username: 'sana.skies', name: 'Sana Qureshi', bio: 'Astrophotography ✨', followers: 51_240, following: 88, postsCount: 92, isPrivate: true },
]

export const YOU: User = {
  id: 'u0',
  username: 'aarav.codes',
  name: 'Aarav Sharma',
  avatar: AVATARS[0],
  verified: false,
  bio: 'Building things for the web ⚡\nDelhi → Bengaluru',
  website: 'aarav.dev',
  followers: 1284,
  following: 342,
  postsCount: 27,
  isFollowing: false,
  online: true,
  isYou: true,
}

export const USERS: User[] = USER_SEEDS.slice(1).map((seed, i) => ({
  id: `u${i + 1}`,
  avatar: AVATARS[(i + 1) % AVATARS.length],
  verified: false,
  isFollowing: false,
  ...seed,
}))

export const ALL_USERS: User[] = [YOU, ...USERS]

export const userById = (id: string): User => ALL_USERS.find((u) => u.id === id) ?? YOU

const commentSeeds: [string, string, number][] = [
  ['u2', 'This is unreal 🔥', 42],
  ['u4', 'Saved for later, thank you!', 18],
  ['u3', 'The light here is perfect', 209],
  ['u6', 'Where is this exactly?', 5],
  ['u9', 'Need a tutorial for this 🙏', 31],
  ['u11', 'Okay this made my day', 77],
  ['u5', 'Framing 👏👏', 12],
  ['u14', 'Adding this to the list', 3],
]

const makeComments = (offset: number): Comment[] =>
  commentSeeds.slice(offset % 4, offset % 4 + 4).map(([userId, text, likes], i) => ({
    id: `c${offset}-${i}`,
    userId,
    text,
    createdAt: now - (2 + i * 3) * HOUR,
    likes,
    likedByYou: false,
    replies:
      i === 0
        ? [
            {
              id: `c${offset}-${i}-r`,
              userId: 'u1',
              text: 'Second this!',
              createdAt: now - HOUR,
              likes: 4,
              likedByYou: false,
            },
          ]
        : [],
  }))

const CAPTIONS: [string, string | null, string[]][] = [
  ['Golden hour on the terrace. No filter needed.', 'Bandra, Mumbai', ['goldenhour', 'citylights']],
  ['Second coffee of the morning, first good idea of the day.', 'Blue Tokai', ['coffee', 'latteart']],
  ['4,200m and the clouds finally moved.', 'Hampta Pass', ['hiking', 'himalayas']],
  ['Night market rules: eat everything, ask questions never.', 'Chandni Chowk', ['streetfood', 'nightmarket']],
  ['Paddled out for 40 minutes, got one wave. Worth it.', 'Varkala', ['surf', 'sunset']],
  ['Rainy Sunday, three books, zero guilt.', null, ['reading', 'cozy']],
  ['Rotation day. Which pair are you taking?', null, ['sneakers', 'flatlay']],
  ['Waited six nights for this. Night eight delivered.', 'Spiti Valley', ['aurora', 'nightsky']],
  ['Learning to let the process lead 🎨', null, ['art', 'studio']],
  ['New loom, same stubborn hands.', 'Jaipur', ['handloom', 'slowfashion']],
  ['Sunrise set, cold water, warm heart.', null, ['mountains', 'trail']],
  ['The city hums different at 3am.', null, ['nightdrive', 'film']],
  ['Fresh batch out of the oven 🍞', null, ['sourdough', 'baking']],
  ['Some walls just want to be painted.', null, ['streetart', 'color']],
]

export const POSTS: Post[] = CAPTIONS.map(([caption, location, tags], i) => {
  const userId = USERS[(i * 3 + 1) % USERS.length].id
  return {
    id: `p${i + 1}`,
    userId,
    // every 3rd post becomes a carousel so swipe + dots are exercised
    media: i % 3 === 0 ? [media(i), media(i + 5), media(i + 9)] : [media(i)],
    caption,
    location: location ?? undefined,
    createdAt: now - (i * 47 + 12) * MIN,
    likes: 240 + ((i * 977) % 12_400),
    likedByYou: false,
    savedByYou: false,
    comments: makeComments(i),
    tags,
    likedByAvatars: [AVATARS[(i + 2) % AVATARS.length], AVATARS[(i + 5) % AVATARS.length], AVATARS[(i + 8) % AVATARS.length]],
  }
})

export const STORIES: Story[] = USERS.filter((_, i) => i % 2 === 0)
  .slice(0, 9)
  .map((u, i) => ({
    id: `s${i + 1}`,
    userId: u.id,
    media: media(i + 2),
    createdAt: now - (i + 1) * 40 * MIN,
    seen: false,
  }))

export const THREADS: Thread[] = [
  {
    id: 't1',
    userId: 'u1',
    unread: 2,
    active: true,
    messages: [
      { id: 'm1', fromMe: false, text: 'Bhai the edit on that last reel 🔥', createdAt: now - 3 * HOUR },
      { id: 'm2', fromMe: true, text: 'Thanks! Colour grade took 2 hours', createdAt: now - 2.6 * HOUR, seen: true },
      { id: 'm3', fromMe: false, text: 'Send me the preset please 🙏', createdAt: now - 22 * MIN },
      { id: 'm4', fromMe: false, text: 'And are we still shooting Saturday?', createdAt: now - 21 * MIN },
    ],
  },
  {
    id: 't2',
    userId: 'u3',
    unread: 0,
    messages: [
      { id: 'm5', fromMe: false, text: 'Location scout done — bring the wide lens', createdAt: now - 8 * HOUR },
      { id: 'm6', fromMe: true, text: 'On it 👍', createdAt: now - 7.5 * HOUR, seen: true },
    ],
  },
  {
    id: 't3',
    userId: 'u5',
    unread: 1,
    messages: [{ id: 'm7', fromMe: false, text: 'Painting is dry, come see it', createdAt: now - 26 * HOUR }],
  },
  {
    id: 't4',
    userId: 'u8',
    unread: 0,
    messages: [
      { id: 'm8', fromMe: true, text: 'Waves were tiny today', createdAt: now - 2 * DAY, seen: true },
      { id: 'm9', fromMe: false, text: 'Tomorrow 6am then 🤙', createdAt: now - 2 * DAY },
    ],
  },
  {
    id: 't5',
    userId: 'u12',
    unread: 0,
    messages: [{ id: 'm10', fromMe: false, text: 'Set list for Friday is up', createdAt: now - 3 * DAY }],
  },
]

export const NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', kind: 'like', userId: 'u1', postId: 'p1', createdAt: now - 12 * MIN, read: false },
  { id: 'n2', kind: 'follow', userId: 'u4', createdAt: now - 48 * MIN, read: false },
  { id: 'n3', kind: 'comment', userId: 'u3', postId: 'p4', text: 'This is unreal 🔥', createdAt: now - 2 * HOUR, read: false },
  { id: 'n4', kind: 'mention', userId: 'u6', postId: 'p7', text: 'mentioned you in a comment: @aarav.codes look!', createdAt: now - 5 * HOUR, read: true },
  { id: 'n5', kind: 'like', userId: 'u9', postId: 'p2', createdAt: now - 9 * HOUR, read: true },
  { id: 'n6', kind: 'tag', userId: 'u11', postId: 'p9', text: 'tagged you in a post', createdAt: now - 27 * HOUR, read: true },
  { id: 'n7', kind: 'follow', userId: 'u13', createdAt: now - 2 * DAY, read: true },
  { id: 'n8', kind: 'like', userId: 'u15', postId: 'p12', createdAt: now - 3 * DAY, read: true },
]

export const SUGGESTED_IDS = ['u4', 'u6', 'u9', 'u11', 'u14', 'u16']

export const EXPLORE_TAGS = ['For you', 'Travel', 'Food', 'Art', 'Music', 'Sports', 'Fashion', 'Nature', 'Tech']

export const formatCount = (n: number): string => {
  if (n < 1000) return String(n)
  if (n < 100_000) return `${(n / 1000).toFixed(n % 1000 >= 100 ? 1 : 0).replace(/\.0$/, '')}K`
  return `${(n / 1000).toFixed(0)}K`
}

export const timeAgo = (ts: number): string => {
  const diff = Date.now() - ts
  if (diff < MIN) return `${Math.max(1, Math.floor(diff / 1000))}s`
  if (diff < HOUR) return `${Math.floor(diff / MIN)}m`
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h`
  if (diff < 7 * DAY) return `${Math.floor(diff / DAY)}d`
  return `${Math.floor(diff / (7 * DAY))}w`
}
