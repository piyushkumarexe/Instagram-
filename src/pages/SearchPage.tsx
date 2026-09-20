import { memo, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Post, User } from '../types'
import { Icon } from '../components/Icon'
import { StaticAvatar } from '../components/ZoomablePhoto'
import { LazyImage } from '../components/LazyImage'
import { useDebouncedValue } from '../hooks'
import { useDispatch, useAppState } from '../store/AppContext'
import { formatCount } from '../data/seed'

type SearchTab = 'top' | 'accounts' | 'tags' | 'places'

export interface SearchPageProps {
  users: User[]
  posts: Post[]
  nameOf: (id: string) => string
}

const TAGS = ['goldenhour', 'streetfood', 'himalayas', 'surf', 'latteart', 'sneakers', 'nightsky', 'handloom', 'sourdough', 'trail']
const PLACES = ['Bandra, Mumbai', 'Spiti Valley', 'Varkala', 'Jaipur', 'Chandni Chowk', 'Hampta Pass']

function SearchPageInner({ users, posts }: SearchPageProps) {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<SearchTab>('top')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const state = useAppState()
  const debounced = useDebouncedValue(query, 180)
  const q = debounced.trim().toLowerCase()

  const accounts = useMemo(
    () =>
      q
        ? users.filter((u) => u.username.includes(q) || u.name.toLowerCase().includes(q)).slice(0, 14)
        : users.filter((u) => !u.isYou).slice(0, 14),
    [q, users],
  )

  const tags = useMemo(() => TAGS.filter((t) => t.includes(q)).slice(0, 9), [q])

  const places = useMemo(() => PLACES.filter((p) => p.toLowerCase().includes(q)).slice(0, 6), [q])

  const tagPosts = useMemo(() => {
    const wanted = q.replace(/^#/, '')
    return posts.filter((p) => p.tags.some((t) => t.includes(wanted)) || p.caption.toLowerCase().includes(wanted)).slice(0, 12)
  }, [posts, q])

  const commit = (value: string) => {
    if (value.trim()) dispatch({ type: 'addRecentSearch', query: value.trim() })
  }

  return (
    <div className="content" style={{ maxWidth: 600 }}>
      <div className="search-field">
        <Icon name="search" size={18} />
        <input
          value={query}
          placeholder="Search people, tags, places"
          aria-label="Search"
          onChange={(e) => setQuery(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && commit(query)}
        />
        {query ? (
          <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
            <Icon name="x" size={16} />
          </button>
        ) : null}
      </div>

      <div className="search-tabs">
        {(
          [
            ['top', 'Top'],
            ['accounts', 'Accounts'],
            ['tags', 'Tags'],
            ['places', 'Places'],
          ] as [SearchTab, string][]
        ).map(([key, label]) => (
          <button type="button" key={key} className={`chip ${tab === key ? 'is-on' : ''}`} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      {!q && state.recentSearches.length ? (
        <div className="pad" style={{ paddingTop: 0 }}>
          <div className="row row--between" style={{ marginBottom: 8 }}>
            <span className="upper">Recent</span>
            <button type="button" className="link-blue small" onClick={() => dispatch({ type: 'clearRecentSearches' })}>
              Clear all
            </button>
          </div>
          {state.recentSearches.map((r) => (
            <button type="button" className="modal__row" key={r} onClick={() => setQuery(r)}>
              <Icon name="search" size={18} />
              <span>{r}</span>
            </button>
          ))}
        </div>
      ) : null}

      {(tab === 'top' || tab === 'accounts') && (
        <div>
          {accounts.map((u) => (
            <button type="button" className="notif" key={u.id} onClick={() => navigate(`/${u.username}`)}>
              <StaticAvatar src={u.avatar} alt={u.username} size={44} />
              <span className="notif__text">
                <span className="bold">{u.username}</span>
                {u.verified ? <Icon name="verified" filled size={12} className="verified" /> : null}
                <br />
                <span className="muted small">
                  {u.name} · {formatCount(u.followers)} followers
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      {(tab === 'top' || tab === 'tags') && tags.length ? (
        <div>
          <div className="group-title">Tags</div>
          <div className="explore-grid" style={{ padding: '0 14px 14px' }}>
            {tags.map((t) => (
              <button type="button" className="explore-cell" key={t} onClick={() => setQuery(t)}>
                <span className="center" style={{ position: 'absolute', inset: 0, background: 'var(--surface-2)' }}>
                  <span className="bold small">#{t}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {(tab === 'top' || tab === 'places') && places.length ? (
        <div>
          <div className="group-title">Places</div>
          {places.map((p) => (
            <button type="button" className="modal__row" key={p}>
              <Icon name="location" size={18} />
              <span>{p}</span>
            </button>
          ))}
        </div>
      ) : null}

      {tab === 'top' && tagPosts.length ? (
        <div className="explore-grid" style={{ padding: '0 14px 24px' }}>
          {tagPosts.map((post) => {
            const m = post.media[0]
            return (
              <button type="button" className="explore-cell" key={post.id} onClick={() => navigate(`/p/${post.id}`)}>
                <LazyImage src={m.src} alt={post.caption} ratio={1} lqip={m.lqip} color={m.color} />
              </button>
            )
          })}
        </div>
      ) : null}

      {q && !accounts.length && !tags.length && !places.length ? (
        <div className="empty">
          <Icon name="search" size={40} />
          <div>No results for “{debounced}”.</div>
        </div>
      ) : null}
    </div>
  )
}

const SearchPage = memo(SearchPageInner)
export default SearchPage
