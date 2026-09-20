import { memo } from 'react'
import type { Story, User } from '../types'
import { groupStories } from '../lib/stories'
import type { StoryGroup } from '../lib/stories'
import { Avatar } from './Avatar'
import { Icon } from './Icon'

export interface StoriesBarProps {
  stories: Story[]
  seenIds: string[]
  you: User
  userById: (id: string) => User
  onOpen: (groups: StoryGroup[], index: number) => void
  onCreate: () => void
}

export const StoriesBar = memo(function StoriesBar({
  stories,
  seenIds,
  you,
  userById,
  onOpen,
  onCreate,
}: StoriesBarProps) {
  const groups = groupStories(stories, seenIds, userById)

  return (
    <div className="stories no-scrollbar" role="list" aria-label="Stories">
      <div className="stories__item" role="listitem">
        <button type="button" onClick={onCreate} aria-label="Add to your story" style={{ position: 'relative' }}>
          <Avatar user={you} size={56} />
          <span className="stories__add">
            <Icon name="plus" size={12} strokeWidth={3} />
          </span>
        </button>
        <span className="stories__name">Your story</span>
      </div>

      {groups.map((group, i) => {
        const seen = group.stories.every((s) => seenIds.includes(s.id))
        return (
          <div className="stories__item" role="listitem" key={group.user.id}>
            {/* tap plays the tray, hold zooms the profile photo — both, like Instagram */}
            <Avatar
              user={group.user}
              size={56}
              ring={seen ? 'seen' : 'unseen'}
              zoom
              openOnTap={false}
              onTap={() => onOpen(groups, i)}
            />
            <span className={`stories__name ${seen ? 'is-seen' : ''} truncate`}>{group.user.username}</span>
          </div>
        )
      })}
    </div>
  )
})
