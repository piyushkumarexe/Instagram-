import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Post, User } from '../types'
import { Icon } from '../components/Icon'
import { LazyImage } from '../components/LazyImage'
import { StaticAvatar } from '../components/ZoomablePhoto'
import { useDispatch } from '../store/AppContext'
import { formatCount, timeAgo } from '../data/seed'
import { useToast } from '../components/Toast'
import { useSwipe } from '../hooks'

const REEL_DURATION = 15_000

export interface ReelsProps {
  posts: Post[]
  byId: Map<string, User>
  you: User
  onShare: (postId: string) => void
}

function ReelsInner({ posts, byId, you, onShare }: ReelsProps) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const toast = useToast()
  const scroller = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [muted, setMuted] = useState(true)
  const frame = useRef<number | undefined>(undefined)

  // reels are the posts that have a single tall image — keeps the vertical feed honest
  const reels = useMemo(() => posts.filter((p) => p.media.length === 1).slice(0, 12), [posts])

  const onScroll = useCallback(() => {
    if (frame.current) return
    frame.current = requestAnimationFrame(() => {
      frame.current = undefined
      const el = scroller.current
      if (!el || !el.clientHeight) return
      const i = Math.round(el.scrollTop / el.clientHeight)
      setActive((cur) => (cur === i ? cur : i))
      setProgress(0)
    })
  }, [])

  // progress bar for the reel on screen
  useEffect(() => {
    if (paused) return
    const started = Date.now() - progress * REEL_DURATION
    const id = window.setInterval(() => {
      const p = Math.min(1, (Date.now() - started) / REEL_DURATION)
      setProgress(p)
      if (p >= 1) {
        const el = scroller.current
        if (el) el.scrollBy({ top: el.clientHeight, behavior: 'smooth' })
      }
    }, 200)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, paused])

  const swipe = useSwipe({
    onLeft: () => setMuted((m) => !m),
  })

  return (
    <div className="reels no-scrollbar" ref={scroller} onScroll={onScroll} {...swipe}>
      {reels.map((post, i) => {
        const author = byId.get(post.userId)
        if (!author) return null
        const isActive = i === active
        const m = post.media[0]
        return (
          <section className="reel" key={post.id} aria-label={`Reel by ${author.username}`}>
            <LazyImage
              src={m.src}
              alt={post.caption}
              ratio={m.ratio}
              lqip={m.lqip}
              color={m.color}
              eager={i === 0}
              imgClassName={`reel__media ${isActive && !paused ? 'is-playing' : ''}`}
              className="reel-lazy"
            />
            <div className="reel__scrim" />

            <div className="reel__progress">
              <span style={{ width: isActive ? `${progress * 100}%` : '0%' }} />
            </div>

            <button
              type="button"
              className="story-viewer__nav"
              style={{ left: 0, right: 0, width: '100%' }}
              aria-label={paused ? 'Play reel' : 'Pause reel'}
              onClick={() => setPaused((p) => !p)}
            />
            {paused ? (
              <span className="center" style={{ position: 'absolute', color: '#fff', zIndex: 3, opacity: 0.9 }}>
                <Icon name="play" filled size={64} />
              </span>
            ) : null}

            <div className="reel__side">
              <button
                type="button"
                className={`center ${post.likedByYou ? 'is-liked' : ''}`}
                style={{ color: post.likedByYou ? 'var(--like)' : '#fff' }}
                aria-label={post.likedByYou ? 'Unlike' : 'Like'}
                onClick={() => dispatch({ type: 'toggleLike', postId: post.id })}
              >
                <Icon name="heart" filled={post.likedByYou} size={28} />
                <span className="count">{formatCount(post.likes)}</span>
              </button>
              <button type="button" className="center" style={{ color: '#fff' }} aria-label="Comments" onClick={() => navigate(`/p/${post.id}`)}>
                <Icon name="comment" size={28} />
                <span className="count">{formatCount(post.comments.length)}</span>
              </button>
              <button
                type="button"
                className="center"
                style={{ color: '#fff' }}
                aria-label="Share reel"
                onClick={() => onShare(post.id)}
              >
                <Icon name="share" size={28} />
              </button>
              <button type="button" className="center" style={{ color: '#fff' }} aria-label="More options" onClick={() => onShare(post.id)}>
                <Icon name="more" size={28} />
              </button>
              <button
                type="button"
                className="center"
                style={{ color: '#fff' }}
                aria-label={post.savedByYou ? 'Unsave' : 'Save'}
                onClick={() => {
                  dispatch({ type: 'toggleSave', postId: post.id })
                  toast(post.savedByYou ? 'Removed from saved' : 'Saved')
                }}
              >
                <Icon name="bookmark" filled={post.savedByYou} size={26} />
              </button>
            </div>

            <div className="reel__info">
              <div className="row">
                <button type="button" onClick={() => navigate(`/${author.username}`)} aria-label={`Open ${author.username}`}>
                  <StaticAvatar src={author.avatar} alt={author.username} size={34} ring="unseen" />
                </button>
                <button type="button" className="bold" onClick={() => navigate(`/${author.username}`)}>
                  {author.username}
                </button>
                {author.verified ? <Icon name="verified" filled size={13} className="verified" /> : null}
                {!author.isFollowing && !author.isYou ? (
                  <button
                    type="button"
                    className="btn btn--outline btn--sm"
                    style={{ borderColor: 'rgba(255,255,255,.6)', color: '#fff' }}
                    onClick={() => {
                      dispatch({ type: 'toggleFollow', userId: author.id })
                      toast(`Following ${author.username}`)
                    }}
                  >
                    Follow
                  </button>
                ) : null}
                <span className="tiny" style={{ opacity: 0.7 }}>
                  {timeAgo(post.createdAt)}
                </span>
              </div>
              <p className="clamp2" style={{ margin: 0 }}>
                {post.caption}
              </p>
              <div className="reel__audio">
                <Icon name="music" size={13} />
                <span className="reel__marquee">
                  <span>{post.tags[0] ? `Original audio · #${post.tags[0]} · ` : 'Original audio · '}</span>
                  <span>{post.tags[0] ? `Original audio · #${post.tags[0]} · ` : 'Original audio · '}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  aria-label={muted ? 'Unmute' : 'Mute'}
                  style={{ color: '#fff' }}
                >
                  <Icon name={muted ? 'mute' : 'volume'} size={16} />
                </button>
              </div>
            </div>
            <span className="sr-only">Reel by {author.username}, posted {timeAgo(post.createdAt)} ago — {you.username} viewing</span>
          </section>
        )
      })}
    </div>
  )
}

const Reels = memo(ReelsInner)
export default Reels
