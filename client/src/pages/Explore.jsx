import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, formatCount } from '../api.js'
import { useApp } from '../store.jsx'
import Avatar from '../components/Avatar.jsx'
import { MobileTopBar } from '../components/MobileNav.jsx'
import { IcHeart, IcComment, IcPlay } from '../components/Icons.jsx'

export default function Explore() {
  const app = useApp()
  const [posts, setPosts] = useState([])
  const [q, setQ] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/explore').then((r) => { setPosts(r.posts); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!q.trim()) { setResults(null); return }
    const t = setTimeout(async () => {
      try {
        const r = await api('/search?q=' + encodeURIComponent(q.trim()))
        setResults(r)
      } catch (e) {}
    }, 300)
    return () => clearTimeout(t)
  }, [q])

  return (
    <div className="explore-page">
      <MobileTopBar title="Explore" />
      <div className="explore-search">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍  Search" />
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
          {!results.users.length && !results.posts.length && (
            <div className="pm-empty"><span className="big-emoji">🔎</span><h3>No results found</h3></div>
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
        <span className="grid-play"><IcPlay size={22} /></span>
      ) : null}
      {post.mediaType === 'video' ? <video src={post.media} muted /> : <img src={post.media} alt={post.caption || 'post'} loading="lazy" />}
      <span className="grid-hover">
        <span><IcHeartFill inline /> {formatCount(post.likes)}</span>
        <span><IcComment inline /> {formatCount(post.commentsCount)}</span>
      </span>
    </button>
  )
}

function IcHeartFill(props) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" {...props}><path d="M12 20.7C7.8 17.8 2.6 13.9 2.6 9.3c0-2.8 2-5 4.7-5 1.9 0 3.6 1 4.7 2.7 1.1-1.7 2.8-2.7 4.7-2.7 2.7 0 4.7 2.2 4.7 5 0 4.6-5.2 8.5-9.4 11.4z" /></svg>
}
function IcCommentFill(props) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" {...props}><path d="M20.7 11.6a8.7 8.7 0 0 1-12.5 7.9L3.4 20.6l1.1-4.7a8.7 8.7 0 1 1 16.2-4.3z" /></svg>
}
