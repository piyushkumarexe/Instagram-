export interface MediaAsset {
  src: string
  width: number
  height: number
  ratio: number
  lqip: string
  color: string
}

export interface User {
  id: string
  username: string
  name: string
  avatar: string
  verified: boolean
  bio: string
  website?: string
  followers: number
  following: number
  postsCount: number
  isFollowing: boolean
  online?: boolean
  isPrivate?: boolean
  isYou?: boolean
}

export interface Comment {
  id: string
  userId: string
  text: string
  createdAt: number
  likes: number
  likedByYou: boolean
  replies?: Comment[]
}

export interface Post {
  id: string
  userId: string
  media: MediaAsset[]
  caption: string
  location?: string
  createdAt: number
  likes: number
  likedByYou: boolean
  savedByYou: boolean
  comments: Comment[]
  tags: string[]
  likedByAvatars: string[]
  /** first liker, used for the "Liked by x and N others" line */
  likedByUserId: string
}

export interface Story {
  id: string
  userId: string
  media: MediaAsset
  createdAt: number
  seen: boolean
  liked?: boolean
}

export interface Message {
  id: string
  fromMe: boolean
  text: string
  createdAt: number
  seen?: boolean
}

export interface Thread {
  id: string
  userId: string
  messages: Message[]
  unread: number
  active?: boolean
}

export type NotificationKind = 'like' | 'comment' | 'follow' | 'mention' | 'tag'

export interface AppNotification {
  id: string
  kind: NotificationKind
  userId: string
  postId?: string
  text?: string
  createdAt: number
  read: boolean
}

export interface CreatedPost {
  id: string
  dataUrl: string
  caption: string
  location?: string
  filter: string
  createdAt: number
}

export type ThemeMode = 'dark' | 'light' | 'system'
