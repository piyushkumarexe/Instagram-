import { memo, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Post, User } from '../types'
import { LazyImage } from '../components/LazyImage'
import { Icon } from '../components/Icon'

export interface SavedProps {
  posts: Post[]
  byId: Map<string, User>
  nameOf: (id: string) => string
  onShare: (postId: string) => void
}

function SavedInner({ posts }: SavedProps) {
  const navigate = useNavigate()
  const saved = useMemo(() => posts.filter((p) => p.savedByYou), [posts])

  return (
    <div className="content content--wide">
      <div className="section-head">
        <span style={{ fontSize: 16 }}>Saved</span>
        <span className="muted small">{saved.length} items</span>
      </div>

      {saved.length === 0 ? (
        <div className="empty">
          <Icon name="bookmark" size={44} />
          <div>
            <div className="bold" style={{ color: 'var(--text)', marginBottom: 6 }}>
              Save photos and videos
            </div>
            Tap the bookmark on any post and it lands here — only you can see it.
          </div>
          <button type="button" className="btn btn--primary" onClick={() => navigate('/')}>
            Back to feed
          </button>
        </div>
      ) : (
        <>
          <div className="row pad" style={{ gap: 12 }}>
            <span className="highlight__ring" style={{ width: 56, height: 56 }}>
              <img src={saved[0].media[0].src} alt="" />
            </span>
            <div>
              <div className="bold">All posts</div>
              <div className="muted small">{saved.length} items</div>
            </div>
          </div>
          <div className="profile-grid">
            {saved.map((post) => {
              const m = post.media[0]
              return (
                <button
                  type="button"
                  key={post.id}
                  className="profile-grid__cell"
                  onClick={() => navigate(`/p/${post.id}`)}
                  aria-label="Open saved post"
                >
                  <LazyImage src={m.src} alt={post.caption} ratio={1} lqip={m.lqip} color={m.color} />
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

const Saved = memo(SavedInner)
export default Saved
