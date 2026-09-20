import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store.jsx'
import { getFeed } from '../fb.js'
import PostCard from '../components/PostCard.jsx'
import StoryBar from '../components/StoryBar.jsx'
import Suggestions from '../components/Suggestions.jsx'
import { MobileTopBar } from '../components/MobileNav.jsx'
import PullToRefresh from '../components/PullToRefresh.jsx'
import Avatar from '../components/Avatar.jsx'
import FollowButton from '../components/FollowButton.jsx'
import { IcVerified } from '../components/Icons.jsx'
import { suggestions } from '../fb.js'

const FEED_CACHE = 'vg_feed_cache'

function readCache() {
  try { return JSON.parse(localStorage.getItem(FEED_CACHE) || 'null') } catch { return null }
}
function writeCache(posts) {
  try {
    // strip volatile fields, keep it small
    localStorage.setItem(FEED_CACHE, JSON.stringify(posts.slice(0, 12).map((p) => ({
      id: p.id, caption: p.caption, media: p.media, mediaType: p.mediaType, type: p.type,
      createdAt: p.createdAt, likes: p.likes, commentsCount: p.commentsCount,
      user: p.user, likedByMe: p.likedByMe, savedByMe: p.savedByMe, comments: p.comments || [],
    }))))
  } catch {}
}

export default function Home() {
  const app = useApp()
  const nav = useNavigate()
  const [posts, setPosts] = useState([])
  const [cursor, setCursor] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const sentinel = useRef(null)
  const loadingMore = useRef(false)

  const load = useCallback(async (cur) => {
    try {
      const r = await getFeed({ cursor: cur })
      setPosts((p) => {
        const next = cur ? [...p, ...r.posts] : r.posts
        writeCache(next)
        return next
      })
      setCursor(r.cursor)
    } catch (e) {
      if (!cur) setLoading(false)
      if (!readCache()) app.toast(e.message)
    } finally {
      if (!cur) setLoading(false)
      loadingMore.current = false
    }
  }, [])

  useEffect(() => {
    // cache-first: instant paint, fresh data in background
    const cached = readCache()
    if (cached?.length) {
      setPosts(cached)
      setLoading(false)
      load()
    } else {
      load()
    }
    const h = () => load()
    window.addEventListener('vg:refresh-feed', h)
    return () => window.removeEventListener('vg:refresh-feed', h)
  }, [])

  useEffect(() => {
    if (!sentinel.current) return
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && cursor && !loadingMore.current) {
        loadingMore.current = true
        load(cursor)
      }
    }, { rootMargin: '600px' })
    obs.observe(sentinel.current)
    return () => obs.disconnect()
  }, [cursor, load])

  function patch(id, p) {
    setPosts((list) => {
      const next = list.map((x) => (x.id === id ? p : x))
      writeCache(next)
      return next
    })
  }

  const [sugg, setSugg] = useState([])
  useEffect(() => { suggestions(app.user.id).then((r) => setSugg(r.slice(0, 6))).catch(() => {}) }, [])

  const refreshAll = useCallback(async () => {
    await load()
    window.dispatchEvent(new Event('vg:refresh-stories'))
  }, [load])

  return (
    <div className="home-page">
      <MobileTopBar />
      <div className="home-cols">
        <div className="home-main">
          <PullToRefresh onRefresh={refreshAll}>
          <StoryBar />
          {loading && !posts.length && <div className="feed-skeleton"><div className="skeleton-card" /><div className="skeleton-card" /></div>}
          {posts.map((p, i) => (
            <React.Fragment key={p.id}>
              <PostCard post={p} onChange={(np) => patch(p.id, np)} onDeleted={() => setPosts((l) => l.filter((x) => x.id !== p.id))} />
              {i === 2 && !!sugg.length && (
                <div className="feed-suggested">
                  <div className="fs-head"><strong>Suggested for you</strong></div>
                  <div className="fs-row">
                    {sugg.map((u) => (
                      <div className="fs-card" key={u.id}>
                        <Avatar user={u} size={56} />
                        <span className="fs-username">{u.username}{u.verified && <IcVerified size={11} style={{ marginLeft: 3 }} />}</span>
                        <span className="fs-name muted">{u.name}</span>
                        <FollowButton user={u} size="sm" onChange={(nu) => setSugg((l) => l.filter((x) => x.id !== nu.id))} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
          {!loading && posts.length === 0 && (
            <div className="feed-empty card">
              <span className="big-emoji">📸</span>
              <h3>Welcome to Instagram 2.0!</h3>
              <p>Follow people to see their photos and videos here — or tap + to create your first post.</p>
              <button className="btn btn-blue" onClick={() => nav('/explore')}>Find people</button>
            </div>
          )}
          {cursor === null && posts.length > 0 && (
            <div className="feed-end">
              <span className="big-emoji">✅</span>
              <h3>You're all caught up</h3>
              <p className="muted">You've seen all new posts.</p>
            </div>
          )}
          <div ref={sentinel} />
          </PullToRefresh>
        </div>
        <Suggestions />
      </div>
    </div>
  )
}
