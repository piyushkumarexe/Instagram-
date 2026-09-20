import type { Story, User } from '../types'

export interface StoryGroup {
  user: User
  stories: Story[]
}

/** Collapses a flat story list into per-user trays, unseen users first (Instagram order). */
export function groupStories(stories: Story[], seenIds: string[], userById: (id: string) => User): StoryGroup[] {
  const map = new Map<string, Story[]>()
  for (const s of stories) {
    const bucket = map.get(s.userId)
    if (bucket) bucket.push(s)
    else map.set(s.userId, [s])
  }
  const groups: StoryGroup[] = [...map.entries()].map(([userId, items]) => ({
    user: userById(userId),
    stories: [...items].sort((a, b) => a.createdAt - b.createdAt),
  }))
  const unseenCount = (g: StoryGroup) => g.stories.filter((s) => !seenIds.includes(s.id)).length
  return groups.sort((a, b) => {
    const diff = unseenCount(b) - unseenCount(a)
    return diff !== 0 ? diff : b.stories[0].createdAt - a.stories[0].createdAt
  })
}

export const STORY_DURATION = 5000
