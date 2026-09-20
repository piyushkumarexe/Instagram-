import { beforeEach, describe, expect, it, vi } from 'vitest'
import { initialState, loadState, persist, reducer, STORAGE_KEY } from './state'
import { mergePost, mergePosts, tokenizeCaption, createdToPost, countComments } from '../lib/posts'
import { POSTS } from '../data/seed'

const first = POSTS[0]

describe('reducer', () => {
  it('toggles likes, saves and follows without mutating the previous state', () => {
    const a = reducer(initialState, { type: 'toggleLike', postId: 'p1' })
    expect(a.liked).toEqual(['p1'])
    expect(initialState.liked).toEqual([])

    const b = reducer(a, { type: 'toggleLike', postId: 'p1' })
    expect(b.liked).toEqual([])

    const c = reducer(a, { type: 'toggleSave', postId: 'p2' })
    expect(c.saved).toEqual(['p2'])

    const d = reducer(a, { type: 'toggleFollow', userId: 'u3' })
    expect(d.following).toEqual(['u3'])
    expect(reducer(d, { type: 'toggleFollow', userId: 'u3' }).following).toEqual([])
  })

  it('appends comments per post and never touches other posts', () => {
    const withComment = reducer(initialState, {
      type: 'addComment',
      postId: 'p1',
      comment: { id: 'x1', userId: 'u0', text: 'nice', createdAt: 1, likes: 0, likedByYou: false },
    })
    expect(withComment.addedComments.p1).toHaveLength(1)
    expect(withComment.addedComments.p2).toBeUndefined()

    const second = reducer(withComment, {
      type: 'addComment',
      postId: 'p1',
      comment: { id: 'x2', userId: 'u0', text: 'again', createdAt: 2, likes: 0, likedByYou: false },
    })
    expect(second.addedComments.p1.map((c) => c.id)).toEqual(['x1', 'x2'])
  })

  it('records story views once, so re-watching does not grow the list', () => {
    const once = reducer(initialState, { type: 'viewStory', storyId: 's1' })
    const twice = reducer(once, { type: 'viewStory', storyId: 's1' })
    expect(twice.seenStories).toEqual(['s1'])
    expect(twice).toBe(once)
  })

  it('sends messages and clears the thread unread count', () => {
    const t = initialState.threads[0]
    const before = t.messages.length
    const next = reducer(initialState, { type: 'sendMessage', threadId: t.id, text: 'hello' })
    const thread = next.threads.find((x) => x.id === t.id)!
    expect(thread.messages).toHaveLength(before + 1)
    expect(thread.messages.at(-1)).toMatchObject({ text: 'hello', fromMe: true })
    expect(thread.unread).toBe(0)
    expect(reducer(next, { type: 'markThreadRead', threadId: t.id })).toEqual(next)
  })

  it('keeps recent searches short and de-duplicated', () => {
    let s = reducer(initialState, { type: 'addRecentSearch', query: 'kavya.frames' })
    expect(s.recentSearches[0]).toBe('kavya.frames')
    expect(s.recentSearches.filter((q) => q === 'kavya.frames')).toHaveLength(1)
    for (let i = 0; i < 12; i++) s = reducer(s, { type: 'addRecentSearch', query: `q${i}` })
    expect(s.recentSearches).toHaveLength(8)
  })

  it('marks every notification read', () => {
    const next = reducer(initialState, { type: 'markNotificationsRead' })
    expect(next.notifications.every((n) => n.read)).toBe(true)
  })

  it('updates the editable profile fields', () => {
    const next = reducer(initialState, { type: 'setProfile', profile: { bio: 'hello world' } })
    expect(next.profile.bio).toBe('hello world')
    expect(next.profile.name).toBe(initialState.profile.name)
  })
})

describe('mergePost', () => {
  it('folds likes, saves and your comments onto a seed post', () => {
    const state = {
      ...initialState,
      liked: [first.id],
      saved: [first.id],
      addedComments: {
        [first.id]: [{ id: 'mine', userId: 'u0', text: 'wow', createdAt: 5, likes: 0, likedByYou: false }],
      },
    }
    const merged = mergePost(first, state)
    expect(merged.likedByYou).toBe(true)
    expect(merged.savedByYou).toBe(true)
    expect(merged.likes).toBe(first.likes + 1)
    expect(merged.comments.at(-1)?.text).toBe('wow')
    expect(countComments(merged)).toBe(countComments(first) + 1)
  })

  it('leaves an untouched post alone', () => {
    const merged = mergePost(first, initialState)
    expect(merged.likedByYou).toBe(false)
    expect(merged.likes).toBe(first.likes)
    expect(merged.comments).toHaveLength(first.comments.length)
  })

  it('maps the whole feed in one pass', () => {
    const merged = mergePosts(POSTS, { ...initialState, liked: [POSTS[2].id] })
    expect(merged).toHaveLength(POSTS.length)
    expect(merged[2].likedByYou).toBe(true)
    expect(merged[0].likedByYou).toBe(false)
  })

  it('turns an upload into a feed post with hashtags extracted', () => {
    const post = createdToPost(
      {
        id: 'up1',
        dataUrl: 'data:image/webp;base64,AAAA',
        caption: 'New spot #bengaluru @mira.travels',
        filter: 'clarendon',
        createdAt: 123,
      },
      'u0',
    )
    expect(post.userId).toBe('u0')
    expect(post.tags).toEqual(['bengaluru'])
    expect(post.media[0].ratio).toBe(1)
  })
})

describe('tokenizeCaption', () => {
  it('splits hashtags and mentions out of plain text', () => {
    const tokens = tokenizeCaption('Sunset run #goldenhour with @kavya.frames 🌇')
    expect(tokens.map((t) => t.kind)).toEqual(['text', 'tag', 'text', 'mention', 'text'])
    expect(tokens[1].text).toBe('#goldenhour')
    expect(tokens[3].text).toBe('@kavya.frames')
  })

  it('returns a single text token when there is nothing to link', () => {
    expect(tokenizeCaption('plain caption')).toEqual([{ text: 'plain caption', kind: 'text' }])
  })
})

describe('persistence', () => {
  beforeEach(() => localStorage.clear())

  it('round-trips the state through localStorage', () => {
    const state = reducer(initialState, { type: 'toggleLike', postId: 'p5' })
    persist(state)
    expect(loadState().liked).toEqual(['p5'])
  })

  it('falls back to defaults when the stored blob is corrupt', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')
    expect(loadState()).toEqual(initialState)
  })

  it('repairs a partial blob from an older schema', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ liked: 'nope', theme: 'neon', saved: ['p1'] }))
    const loaded = loadState()
    expect(loaded.liked).toEqual([])
    expect(loaded.theme).toBe('system')
    expect(loaded.saved).toEqual(['p1'])
  })

  it('survives a quota error by dropping uploads and retrying', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new Error('QuotaExceededError')
    })
    expect(() => persist(initialState)).not.toThrow()
    expect(spy).toHaveBeenCalledTimes(2)
  })
})
