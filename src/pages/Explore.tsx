import { memo, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Post, User } from '../types'
import { EXPLORE_TAGS } from '../data/seed'
import { LazyImage } from '../components/LazyImage'
import { Icon } from '../components/Icon'
import { searchPosts } from '../lib/posts'

const TAG_TO_QUERY: Record<string, string> = {
  Travel: 'himalayas',
  Food: 'coffee',
  Art: 'art',
  Music: 'beats',
  Sports: 'surf',
  Fashion: 'sneakers',
  Nature: 'nightsky',
  Tech: 'film',
}

export interface ExploreProps {
  posts: Post[]
  byId: Map<string, User>
  nameOf: (id: string) => string
  onShare: (postId: string) => void
}

function ExploreInner({ posts }: ExploreProps) {
  const [tag, setTag] = useState('For you')
  const navigate = useNavigate()

  const grid = useMemo(() => {
    const q = TAG_TO_QUERY[tag]
    const filtered = q ? searchPosts(posts, q) : posts
    // fall back to everything if a tag has no matches so the grid never looks broken
    const source = filtered.length ? filtered : posts
    // interleave so the same photos do not repeat back-to-back
    const seen = new Set<string>()
    const out: Post[] = []
    let i = 0
    while (out.length < 24) {
      const p = source[i % source.length]
      if (!seen.has(p.id)) {
        seen.add(p.id)
        out.push(p)
      }
      i++
      if (i > source.length * 3) break
    }
    return out
  }, [posts, tag])

  return (
    <div className="content content--wide">
      <div className="explore-tags no-scrollbar">
        {EXPLORE_TAGS.map((t) => (
          <button
            type="button"
            key={t}
            className={`chip ${tag === t ? 'is-on' : ''}`}
            onClick={() => setTag(t)}
            aria-pressed={tag === t}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="explore-grid">
        {grid.map((post, i) => {
          const m = post.media[0]
          const tall = i % 10 === 2
          return (
            <button
              type="button"
              key={`${post.id}-${i}`}
              className={`explore-cell ${tall ? 'explore-cell--tall' : ''}`}
              onClick={() => navigate(`/p/${post.id}`)}
              aria-label={`Open post by ${post.userId}`}
            >
              <LazyImage src={m.src} alt={post.caption} ratio={1} lqip={m.lqip} color={m.color} />
              {post.media.length > 1 ? (
                <span className="post__badge">
                  <Icon name="grid" size={16} />
                </span>
              ) : null}
              <span className="explore-cell__hover">
                <span className="row">
                  <Icon name="heart" filled size={18} /> {post.likes.toLocaleString('en-US')}
                </span>
                <span className="row">
                  <Icon name="comment" filled size={18} /> {post.comments.length}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

const Explore = memo(ExploreInner)
export default Explore
