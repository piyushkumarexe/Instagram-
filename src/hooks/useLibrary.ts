import { useMemo } from 'react'
import { ALL_USERS, POSTS, STORIES, YOU } from '../data/seed'
import { createdToPost, mergePosts } from '../lib/posts'
import { useAppState } from '../store/AppContext'
import type { Post, Story, User } from '../types'

export interface Library {
  you: User
  users: User[]
  byId: Map<string, User>
  nameOf: (id: string) => string
  posts: Post[]
  stories: Story[]
  unreadMessages: number
  unreadNotifications: number
}

/**
 * Single place where seed data + the user's own actions become the app's data.
 * Everything is memoised on the slices it actually reads, so liking a post does not
 * rebuild the user list and vice-versa.
 */
export function useLibrary(): Library {
  const state = useAppState()

  const users = useMemo(
    () =>
      ALL_USERS.map((u) => {
        const toggled = state.following.includes(u.id)
        const base = u.id === YOU.id ? { ...u, ...state.profile } : u
        return { ...base, isFollowing: base.isFollowing !== toggled }
      }),
    [state.following, state.profile],
  )

  const byId = useMemo(() => new Map(users.map((u) => [u.id, u])), [users])

  const posts = useMemo(() => {
    const mine = state.createdPosts.map((cp) => createdToPost(cp, YOU.id))
    return mergePosts([...mine, ...POSTS], state)
  }, [state])

  const nameOf = useMemo(() => {
    const map = byId
    return (id: string) => map.get(id)?.username ?? 'user'
  }, [byId])

  const unreadMessages = useMemo(() => state.threads.reduce((n, t) => n + t.unread, 0), [state.threads])
  const unreadNotifications = useMemo(
    () => state.notifications.filter((n) => !n.read).length,
    [state.notifications],
  )

  const you = useMemo(
    () => ({ ...YOU, ...state.profile, postsCount: YOU.postsCount + state.createdPosts.length }),
    [state.createdPosts.length, state.profile],
  )

  const stories = useMemo<Story[]>(
    () => STORIES.map((s) => ({ ...s, seen: state.seenStories.includes(s.id) })),
    [state.seenStories],
  )

  return { you, users, byId, nameOf, posts, stories, unreadMessages, unreadNotifications }
}
