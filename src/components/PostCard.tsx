import { memo, useCallback, useEffect, useRef, useState } from 'react'
import type { Post, User } from '../types'
import { countComments, likedByLine, tokenizeCaption } from '../lib/posts'
import { timeAgo } from '../data/seed'
import { Avatar } from './Avatar'
import { Icon } from './Icon'
import { LazyImage } from './LazyImage'

export interface PostCardProps {
  post: Post
  author: User
  you: User
  likedByName: string
  onLike: (on: boolean) => void
  onSave: () => void
  onComment: (text: string) => void
  onOpenDetail: () => void
  onOpenAuthor: () => void
  onShare: () => void
  onFollow?: () => void
  nameOf: (userId: string) => string
}

export const PostCard = memo(function PostCard({
  post,
  author,
  you,
  likedByName,
  onLike,
  onSave,
  onComment,
  onOpenDetail,
  onOpenAuthor,
  onShare,
  onFollow,
  nameOf,
}: PostCardProps) {
  const [index, setIndex] = useState(0)
  const [burst, setBurst] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [draft, setDraft] = useState('')
  const scroller = useRef<HTMLDivElement | null>(null)
  const frame = useRef<number | undefined>(undefined)

  const isCarousel = post.media.length > 1
  const commentCount = countComments(post)

  // scroll → active dot, throttled to animation frames (cheap on long feeds)
  const onScroll = useCallback(() => {
    if (frame.current) return
    frame.current = requestAnimationFrame(() => {
      frame.current = undefined
      const el = scroller.current
      if (!el || !el.clientWidth) return
      setIndex(Math.round(el.scrollLeft / el.clientWidth))
    })
  }, [])

  useEffect(() => () => cancelAnimationFrame(frame.current ?? 0), [])

  const doubleTapLike = useCallback(() => {
    setBurst((b) => b + 1)
    if (!post.likedByYou) onLike(true)
  }, [onLike, post.likedByYou])

  const submitComment = () => {
    const text = draft.trim()
    if (!text) return
    onComment(text)
    setDraft('')
  }

  const longCaption = post.caption.length > 96

  return (
    <article className="post" aria-label={`Post by ${author.username}`}>
      <header className="post__head">
        {/* the avatar is itself the control: tap opens the profile, hold zooms the photo */}
        <Avatar user={author} size={34} zoom openOnTap={false} onTap={onOpenAuthor} />
        <div className="post__head-text">
          <div className="row" style={{ gap: 4 }}>
            <button type="button" className="post__username" onClick={onOpenAuthor}>
              {author.username}
            </button>
            {author.verified ? <Icon name="verified" filled size={13} className="verified" /> : null}
            {onFollow && !author.isFollowing && !author.isYou ? (
              <>
                <span className="muted">·</span>
                <button type="button" className="link-blue small" onClick={onFollow}>
                  Follow
                </button>
              </>
            ) : null}
          </div>
          {post.location ? <div className="post__loc truncate">{post.location}</div> : null}
        </div>
        <button type="button" className="icon-btn" onClick={onShare} aria-label="More options">
          <Icon name="more" size={20} />
        </button>
      </header>

      <div className="post__media" onDoubleClick={doubleTapLike}>
        {isCarousel ? (
          <>
            <div className="post__carousel no-scrollbar" ref={scroller} onScroll={onScroll}>
              {post.media.map((m, i) => (
                <div className="post__slide" key={`${post.id}-${i}`}>
                  <LazyImage
                    src={m.src}
                    alt={`${post.caption} — image ${i + 1}`}
                    ratio={m.ratio}
                    lqip={m.lqip}
                    color={m.color}
                    eager={i === 0}
                  />
                </div>
              ))}
            </div>
            <div className="post__dots" aria-hidden="true">
              {post.media.map((_, i) => (
                <span className={`post__dot ${i === index ? 'is-on' : ''}`} key={i} />
              ))}
            </div>
            <div className="post__badge">
              <Icon name="grid" size={18} />
            </div>
          </>
        ) : (
          <LazyImage
            src={post.media[0].src}
            alt={post.caption}
            ratio={post.media[0].ratio}
            lqip={post.media[0].lqip}
            color={post.media[0].color}
            eager
          />
        )}

        {burst > 0 ? (
          <span key={burst} className="post__heart is-burst">
            <Icon name="heart" filled size={110} />
          </span>
        ) : null}
      </div>

      <div className="post__actions">
        <button
          type="button"
          className={`icon-btn ${post.likedByYou ? 'is-liked' : ''}`}
          onClick={() => onLike(!post.likedByYou)}
          aria-pressed={post.likedByYou}
          aria-label={post.likedByYou ? 'Unlike' : 'Like'}
        >
          <Icon name="heart" filled={post.likedByYou} size={25} />
        </button>
        <button type="button" className="icon-btn" onClick={onOpenDetail} aria-label="Comment">
          <Icon name="comment" size={25} />
        </button>
        <button type="button" className="icon-btn" onClick={onShare} aria-label="Share">
          <Icon name="share" size={25} />
        </button>
        <span className="spacer" />
        <button
          type="button"
          className="icon-btn"
          onClick={onSave}
          aria-pressed={post.savedByYou}
          aria-label={post.savedByYou ? 'Remove from saved' : 'Save'}
        >
          <Icon name="bookmark" filled={post.savedByYou} size={24} />
        </button>
      </div>

      <div className="post__body">
        <div className="post__likes">{likedByLine(post, [likedByName])}</div>

        <div className="post__caption">
          <button type="button" className="bold" onClick={onOpenAuthor} style={{ marginRight: 6 }}>
            {author.username}
          </button>
          {(longCaption && !expanded ? `${post.caption.slice(0, 96)}…` : post.caption).split('\n').map((line, i) => (
            <span key={i}>
              {i > 0 ? <br /> : null}
              {tokenizeCaption(line).map((t, j) =>
                t.kind === 'text' ? (
                  <span key={j}>{t.text}</span>
                ) : (
                  <span key={j} className="tag">
                    {t.text}
                  </span>
                ),
              )}
            </span>
          ))}
          {longCaption && !expanded ? (
            <button type="button" className="post__more" onClick={() => setExpanded(true)}>
              {' '}
              more
            </button>
          ) : null}
        </div>

        {commentCount > 0 ? (
          <button type="button" className="post__comments-link" onClick={onOpenDetail}>
            View all {commentCount.toLocaleString('en-US')} comments
          </button>
        ) : null}

        {post.comments.slice(-2).map((c) => (
          <div className="post__caption" key={c.id}>
            <span className="bold" style={{ marginRight: 6 }}>
              {nameOf(c.userId)}
            </span>
            {c.text}
          </div>
        ))}

        <div className="post__time">{timeAgo(post.createdAt)} ago</div>
      </div>

      <form
        className="post__add-comment"
        onSubmit={(e) => {
          e.preventDefault()
          submitComment()
        }}
      >
        <Avatar user={you} size={26} />
        <input
          value={draft}
          placeholder="Add a comment…"
          aria-label="Add a comment"
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit" className="link-blue" disabled={!draft.trim()} aria-label="Post comment">
          Post
        </button>
      </form>
    </article>
  )
})
