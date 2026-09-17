import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { api, formatCount } from '../api.js'
import { useApp } from '../store.jsx'
import Avatar from '../components/Avatar.jsx'
import FollowButton from '../components/FollowButton.jsx'
import { IcHeart, IcHeartFill, IcComment, IcSend, IcMute, IcSound, IcPlay } from '../components/Icons.jsx'

export default function Reels() {
  const app = useApp()
  const [reels, setReels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/explore')
      .then(async (r) => {
        let list = r.posts.filter((p) => p.type === 'reel')
        if (list.length < 3) {
          // fall back to popular posts so the page never feels empty
          const feed = await api('/feed')
          list = [...list, ...feed.posts.filter((p) => p.type !== 'reel')].slice(0, 6)
        }
        setReels(list)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  function patch(id, p) {
    setReels((l) => l.map((x) => (x.id === id ? p : x)))
  }

  if (!loading && !reels.length) {
    return (
      <div className="reels-page">
        <div className="pm-empty"><span className="big-emoji">🎬</span><h3>No reels yet</h3><p>Tap + and share your first reel!</p></div>
      </div>
    )
  }

  return (
    <div className="reels-page">
      <div className="reels-scroller">
        {reels.map((r) => (
          <ReelItem key={r.id} reel={r} onChange={(p) => patch(r.id, p)} />
        ))}
      </div>
    </div>
  )
}

function ReelItem({ reel, onChange }) {
  const app = useApp()
  const wrapRef = useRef(null)
  const vidRef = useRef(null)
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        const v = vidRef.current
        if (entries[0].isIntersecting) {
          if (v) v.play().catch(() => {})
          setPlaying(true)
        } else {
          if (v) v.pause()
          setPlaying(false)
        }
      },
      { threshold: 0.6 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  function tapMedia() {
    const v = vidRef.current
    if (!v) return
    if (v.paused) { v.play().catch(() => {}); setPlaying(true) } else { v.pause(); setPlaying(false) }
  }

  async function toggleLike() {
    const r = await api(`/posts/${reel.id}/like`, { method: 'POST' })
    onChange({ ...reel, likedByMe: r.liked, likes: r.likes })
  }

  async function share() {
    try { await navigator.clipboard.writeText(`${location.origin}/p/${reel.id}`); app.toast('Link copied 🔗') } catch {}
  }

  return (
    <div className="reel-item" ref={wrapRef}>
      <div className="reel-media">
        {reel.mediaType === 'video' ? (
          <video ref={vidRef} src={reel.media} loop muted={muted} playsInline onClick={tapMedia} />
        ) : (
          <div className="reel-kenburns">
            <img src={reel.media} alt="" draggable="false" />
          </div>
        )}
        {reel.mediaType === 'video' && !playing && (
          <div className="reel-paused"><IcPlay size={64} /></div>
        )}
        {reel.mediaType === 'video' && (
          <button className="reel-mute icon-btn light" onClick={() => { setMuted((m) => !m); vidRef.current.muted = !muted }}>
            {muted ? <IcMute size={20} /> : <IcSound size={20} />}
          </button>
        )}
      </div>

      <div className="reel-overlay">
        <div className="reel-info">
          <div className="reel-user-row">
            <Link to={'/' + reel.user.username}><Avatar user={reel.user} size={32} /></Link>
            <Link to={'/' + reel.user.username} className="reel-username">{reel.user.username}</Link>
            <FollowButton user={reel.user} size="sm" onChange={(u) => onChange({ ...reel, user: { ...reel.user, ...u } })} />
          </div>
          <div className="reel-caption">{reel.caption}</div>
          <div className="reel-music">♫ original audio — {reel.user.username}</div>
        </div>
        <div className="reel-rail">
          <button className="reel-rail-btn" onClick={toggleLike}>
            {reel.likedByMe ? <IcHeartFill size={28} className="liked" /> : <IcHeart size={28} />}
            <span>{formatCount(reel.likes)}</span>
          </button>
          <button className="reel-rail-btn" onClick={() => app.openPost(reel.id)}>
            <IcComment size={26} />
            <span>{formatCount(reel.commentsCount)}</span>
          </button>
          <button className="reel-rail-btn" onClick={share}>
            <IcSend size={26} />
          </button>
        </div>
      </div>
    </div>
  )
}
