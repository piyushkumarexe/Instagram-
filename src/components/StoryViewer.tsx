import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { StoryGroup } from '../lib/stories'
import { STORY_DURATION } from '../lib/stories'
import { useSwipe } from '../hooks'
import { Icon } from './Icon'
import { StaticAvatar } from './ZoomablePhoto'
import { timeAgo } from '../data/seed'

export interface StoryViewerProps {
  groups: StoryGroup[]
  startGroup: number
  seenIds: string[]
  onClose: () => void
  onSeen: (storyId: string) => void
  onLike: (storyId: string) => void
  likedIds: string[]
  onReply: (group: StoryGroup, text: string) => void
}

/**
 * Full-screen story player: auto-advances every 5s, tap left/right to move between
 * frames and trays, hold to pause (Instagram does this too), swipe to change tray,
 * Esc closes. Frames are marked seen as they play.
 */
export const StoryViewer = memo(function StoryViewer({
  groups,
  startGroup,
  seenIds,
  onClose,
  onSeen,
  onLike,
  likedIds,
  onReply,
}: StoryViewerProps) {
  const [gi, setGi] = useState(Math.min(startGroup, Math.max(0, groups.length - 1)))
  const [si, setSi] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reply, setReply] = useState('')
  const [burst, setBurst] = useState(0)
  const timer = useRef<number | undefined>(undefined)

  const group = groups[gi]
  const story = group?.stories[si]

  const advance = useCallback(
    (dir: 1 | -1) => {
      setSi((cur) => {
        const g = groups[gi]
        if (!g) return cur
        if (dir === 1 && cur < g.stories.length - 1) return cur + 1
        if (dir === -1 && cur > 0) return cur - 1
        // spill over into the next tray
        setGi((gcur) => {
          const next = gcur + dir
          if (next < 0 || next >= groups.length) {
            onClose()
            return gcur
          }
          setSi(dir === 1 ? 0 : groups[next].stories.length - 1)
          return next
        })
        return cur
      })
    },
    [gi, groups, onClose],
  )

  // autoplay
  useEffect(() => {
    if (!story || paused) return
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => advance(1), STORY_DURATION)
    return () => window.clearTimeout(timer.current)
  }, [story, paused, advance, gi, si])

  // mark seen the moment a frame shows
  useEffect(() => {
    if (story && !seenIds.includes(story.id)) onSeen(story.id)
  }, [story, seenIds, onSeen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') advance(1)
      if (e.key === 'ArrowLeft') advance(-1)
      if (e.key === ' ') {
        e.preventDefault()
        setPaused((p) => !p)
      }
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [advance, onClose])

  const swipe = useSwipe({ onLeft: () => advance(1), onRight: () => advance(-1), onDown: onClose })

  const hold = {
    onPointerDown: (e: ReactPointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      setPaused(true)
    },
    onPointerUp: () => setPaused(false),
    onPointerCancel: () => setPaused(false),
    onPointerLeave: () => setPaused(false),
  }

  const total = group?.stories.length ?? 0

  const sendReply = () => {
    const text = reply.trim()
    if (!text || !group) return
    onReply(group, text)
    setReply('')
  }

  const liked = story ? likedIds.includes(story.id) : false

  const heart = useMemo(
    () => (
      <button
        type="button"
        className={`icon-btn ${liked ? 'is-liked' : ''}`}
        style={{ color: liked ? 'var(--like)' : '#fff' }}
        aria-label="Like story"
        onClick={() => {
          if (story) onLike(story.id)
          setBurst((b) => b + 1)
        }}
      >
        <Icon name="heart" filled={liked} size={26} />
      </button>
    ),
    [liked, onLike, story],
  )

  if (!group || !story) return null

  return (
    <div className="story-viewer" role="dialog" aria-modal="true" aria-label="Story viewer">
      <div className="story-viewer__frame" {...swipe} {...hold}>
        <img key={story.id} className="story-viewer__img" src={story.media.src} alt="" draggable={false} />

        <div className="story-viewer__bars">
          {group.stories.map((s, i) => (
            <div
              key={s.id}
              className={`story-viewer__bar ${i < si ? 'is-done' : ''} ${i === si && !paused ? 'is-live' : ''}`}
            >
              <span style={{ animationDuration: `${STORY_DURATION}ms` }} />
            </div>
          ))}
        </div>

        <div className="story-viewer__top">
          <StaticAvatar src={group.user.avatar} alt={group.user.username} size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="bold truncate" style={{ fontSize: 14 }}>
              {group.user.username}
            </div>
            <div className="tiny" style={{ opacity: 0.75 }}>
              {timeAgo(story.createdAt)}
            </div>
          </div>
          {paused ? <span className="tiny" style={{ opacity: 0.8 }}>Paused</span> : null}
          <button type="button" className="icon-btn story-viewer__close" onClick={onClose} aria-label="Close stories">
            <Icon name="x" size={24} />
          </button>
        </div>

        <button
          type="button"
          className="story-viewer__nav story-viewer__nav--left"
          aria-label="Previous story"
          onClick={() => advance(-1)}
        />
        <button
          type="button"
          className="story-viewer__nav story-viewer__nav--right"
          aria-label="Next story"
          onClick={() => advance(1)}
        />

        <div className="story-viewer__reply">
          <input
            value={reply}
            placeholder={`Reply to ${group.user.username}…`}
            aria-label="Reply to story"
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendReply()}
            onPointerDown={(e) => e.stopPropagation()}
          />
          {heart}
          <button
            type="button"
            className="icon-btn"
            style={{ color: '#fff' }}
            aria-label="Send story"
            onClick={() => advance(1)}
          >
            <Icon name="send" size={24} />
          </button>
        </div>

        {burst > 0 ? (
          <div key={burst} className="post__heart is-burst" style={{ position: 'absolute' }}>
            <Icon name="heart" filled size={110} />
          </div>
        ) : null}

        <div className="tiny" style={{ position: 'absolute', bottom: 60, right: 12, color: '#fff', opacity: 0.6 }}>
          {si + 1}/{total}
        </div>
      </div>
    </div>
  )
})
