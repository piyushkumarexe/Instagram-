import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { StoryViewer } from './StoryViewer'
import { groupStories } from '../lib/stories'
import { STORIES, userById } from '../data/seed'

const buildGroups = () => groupStories(STORIES, [], userById)

describe('StoryViewer', () => {
  const setup = (seenIds: string[] = []) => {
    const groups = buildGroups()
    const onSeen = vi.fn()
    const onClose = vi.fn()
    const onLike = vi.fn()
    const onReply = vi.fn()
    render(
      <StoryViewer
        groups={groups}
        startGroup={0}
        seenIds={seenIds}
        likedIds={[]}
        onSeen={onSeen}
        onClose={onClose}
        onLike={onLike}
        onReply={onReply}
      />,
    )
    return { groups, onSeen, onClose, onLike, onReply }
  }

  it('plays the first tray and marks it seen', () => {
    const { groups, onSeen } = setup()
    expect(screen.getByText(groups[0].user.username)).toBeInTheDocument()
    expect(screen.getByText('1/1')).toBeInTheDocument()
    expect(onSeen).toHaveBeenCalledWith(groups[0].stories[0].id)
  })

  it('advances to the next tray and back again', () => {
    const { groups } = setup()
    fireEvent.click(screen.getByLabelText('Next story'))
    expect(screen.getByText(groups[1].user.username)).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Previous story'))
    expect(screen.getByText(groups[0].user.username)).toBeInTheDocument()
  })

  it('asks to close at the last tray instead of running off the end', () => {
    const { groups, onClose } = setup()
    const last = groups[groups.length - 1]
    // one click per tray walks the whole rail, plus one that tries to go past the end
    for (let i = 0; i < groups.length; i++) fireEvent.click(screen.getByLabelText('Next story'))

    expect(onClose).toHaveBeenCalledTimes(1)
    // the viewer stays on the last tray (its parent is what unmounts it) and never crashes
    expect(screen.getByText(last.user.username)).toBeInTheDocument()
    expect(screen.getByText('1/1')).toBeInTheDocument()
  })

  it('Escape closes, and liking a story reports the id', () => {
    const { groups, onClose, onLike } = setup()
    fireEvent.click(screen.getByLabelText('Like story'))
    expect(onLike).toHaveBeenCalledWith(groups[0].stories[0].id)

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not re-report a story that was already seen', () => {
    const groups = buildGroups()
    const onSeen = vi.fn()
    render(
      <StoryViewer
        groups={groups}
        startGroup={0}
        seenIds={[groups[0].stories[0].id]}
        likedIds={[]}
        onSeen={onSeen}
        onClose={vi.fn()}
        onLike={vi.fn()}
        onReply={vi.fn()}
      />,
    )
    expect(onSeen).not.toHaveBeenCalled()
  })

  it('replies go to the right person', () => {
    const { groups, onReply } = setup()
    const input = screen.getByLabelText('Reply to story')
    fireEvent.change(input, { target: { value: 'kya baat hai' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onReply).toHaveBeenCalledWith(groups[0], 'kya baat hai')
  })
})

describe('groupStories', () => {
  it('collapses stories per user and puts unseen trays first', () => {
    const groups = groupStories(STORIES, [STORIES[0].id], userById)
    const ids = groups.map((g) => g.user.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(groups[0].user.id).not.toBe(STORIES[0].userId)
    expect(groups.some((g) => g.user.id === STORIES[0].userId)).toBe(true)
  })

  it('sorts each tray chronologically', () => {
    const groups = groupStories(STORIES, [], userById)
    for (const g of groups) {
      const times = g.stories.map((s) => s.createdAt)
      expect(times).toEqual([...times].sort((a, b) => a - b))
    }
  })
})
