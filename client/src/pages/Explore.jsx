import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from '../store.jsx'
import { explore, searchUsers, searchPosts, formatCount } from '../fb.js'
import Avatar from '../components/Avatar.jsx'
import { MobileTopBar } from '../components/MobileNav.jsx'
import { IcComment } from '../components/Icons.jsx'

export default function Explore() {
  const app = useApp()
  const [posts, setPosts] = useState([])
  const [sp, setSp] = useSearchParams()
  const [q, setQ] = useState(sp.get('q') || '')
  const [results, setResults] = useState(null)
  const [searchErr, setSearchErr] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    explore(app.user.id).then((r) => { setPosts(r); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!q.trim()) { setResults(null); setSp({}); return }
    setSp({ q: q.trim() }, { replace: true })
    const t = setTimeout(async () => {
      try {
        setSearchErr('')
        const [users, searchResultsPosts] = await Promise.all([searchUsers(q.trim()), searchPosts(q.trim())])
        setResults({ users, posts: searchResultsPosts })
      } catch (err) {
        setSearchErr('Search issue: ' + err.message + ' — exact username try karo')
        setResults({ users: [], posts: [] })
      }
    }, 300)
    return () => clearTimeout(t)
  }, [q])

  return (
    <div className="explore-page">
      <MobileTopBar title="Explore" />
      <div className="explore-search">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 Search username, name, caption" />
      </div>
      {loading && <div className="grid-skeleton">{Array.from({ length: 9 }).map((_, i) => <div key={i} className="skeleton-grid" />)}</div>}

      {results ? (
        <div className="explore-results">
          {results.users.length > 0 && (
            <div className="explore-users">
              {results.users.map((u) => (
                <Link key={u.id} to={'/' + u.username} className="search-user-row">
                  <Avatar user={u} size={44} />
                  <div className="search-user-meta">
                    <span className="username">{u.username}</span>
                    <span className="name">{u.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {results.posts.length > 0 && (
            <div className="explore-grid">
              {results.posts.map((p) => <GridCell post={p} key={p.id} />)}
            </div>
          )}
          {searchErr && <div className="pm-empty"><span className="big-emoji">⚠️</span><h3 style={{ fontSize: 14 }}>{searchErr}</h3></div>}
          {!results.users.length && !results.posts.length && !searchErr && (
            <div className="pm-empty"><span className="big-emoji">🔎</span><h3>No results found</h3><p style={{ color: 'var(--muted)', fontSize: 13 }}>Username ya caption keywords try karo</p></div>
          )}
        </div>
      ) : (
        <div className="explore-grid">
          {posts.map((p) => <GridCell post={p} key={p.id} />)}
        </div>
      )}
    </div>
  )
}

function GridCell({ post }) {
  const app = useApp()
  return (
    <button className="grid-cell" onClick={() => app.openPost(post.id)}>
      {post.mediaType === 'video' || post.type === 'reel' ? (
        <span className="grid-play"><IcPlay /></span>
      ) : null}
      {post.mediaType === 'video' ? <video src={post.media} muted /> : <img src={post.media} alt={post.caption || 'post'} loading="lazy" />}
      <span className="grid-hover">
        <span>❤️ {formatCount(post.likes)}</span>
        <span>💬 {formatCount(post.commentsCount)}</span>
      </span>
    </button>
  )
}

function IcPlay() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M7 4.5 19.5 12 7 19.5z" /></svg>
}
