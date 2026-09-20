import type { AppState } from '../store/state'
import type { Comment, CreatedPost, MediaAsset, Post } from '../types'

/** Folds persisted user actions (likes, saves, your comments) onto a seed post. */
export function mergePost(post: Post, state: AppState): Post {
  const likedByYou = state.liked.includes(post.id)
  const savedByYou = state.saved.includes(post.id)
  const mine = state.addedComments[post.id] ?? []
  const comments = [...post.comments, ...mine].map((c) => ({
    ...c,
    likedByYou: state.likedComments.includes(c.id),
    likes: c.likes + (state.likedComments.includes(c.id) ? 1 : 0),
    replies: c.replies?.map((r) => ({
      ...r,
      likedByYou: state.likedComments.includes(r.id),
      likes: r.likes + (state.likedComments.includes(r.id) ? 1 : 0),
    })),
  }))
  return {
    ...post,
    comments,
    likedByYou,
    savedByYou,
    likes: post.likes + (likedByYou ? 1 : 0),
  }
}

export function mergePosts(posts: Post[], state: AppState): Post[] {
  return posts.map((p) => mergePost(p, state))
}

/** Turns a user upload into a real Post so it flows through the same feed code. */
export function createdToPost(cp: CreatedPost, ownerId: string): Post {
  const media: MediaAsset = {
    src: cp.dataUrl,
    width: 1080,
    height: 1080,
    ratio: 1,
    lqip: '',
    color: '#111',
  }
  return {
    id: cp.id,
    userId: ownerId,
    media: [media],
    caption: cp.caption,
    location: cp.location,
    createdAt: cp.createdAt,
    likes: 0,
    likedByYou: false,
    savedByYou: false,
    comments: [],
    tags: (cp.caption.match(/#[\w]+/g) ?? []).map((t) => t.slice(1)),
    likedByAvatars: [],
    likedByUserId: 'u1',
  }
}

/** Splits a caption into plain text / @mention / #hashtag tokens for styling + links. */
export function tokenizeCaption(caption: string): { text: string; kind: 'text' | 'tag' | 'mention' }[] {
  const out: { text: string; kind: 'text' | 'tag' | 'mention' }[] = []
  const re = /(#[\p{L}\p{N}_]+|@[\p{L}\p{N}._]+)/gu
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(caption))) {
    if (m.index > last) out.push({ text: caption.slice(last, m.index), kind: 'text' })
    out.push({ text: m[0], kind: m[0].startsWith('#') ? 'tag' : 'mention' })
    last = m.index + m[0].length
  }
  if (last < caption.length) out.push({ text: caption.slice(last), kind: 'text' })
  return out
}

export const countComments = (post: Post): number =>
  post.comments.reduce((n, c) => n + 1 + (c.replies?.length ?? 0), 0)

/** "Liked by kavya.frames and 12,403 others" — Instagram's summary line. */
export function likedByLine(post: Post, names: string[]): string {
  if (!post.likedByAvatars.length) return `${post.likes.toLocaleString('en-US')} likes`
  const first = names[0] ?? 'someone'
  const rest = post.likes - 1
  return rest > 0 ? `Liked by ${first} and ${rest.toLocaleString('en-US')} others` : `Liked by ${first}`
}

export function sortPosts(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => b.createdAt - a.createdAt)
}

export function searchPosts(posts: Post[], query: string): Post[] {
  const q = query.trim().toLowerCase()
  if (!q) return posts
  return posts.filter(
    (p) => p.caption.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q)) || (p.location ?? '').toLowerCase().includes(q),
  )
}

export const newCommentId = (): string => `uc${Date.now()}${Math.floor(Math.random() * 999)}`

export type { Comment }
