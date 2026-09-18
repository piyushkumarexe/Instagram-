import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../store.jsx'
import { getReels, formatCount, toggleLike, withTimeout, buzz } from '../fb.js'
import Avatar from '../components/Avatar.jsx'
import FollowButton from '../components/FollowButton.jsx'
import { IcHeart, IcHeartFill, IcComment, IcSend, IcMute, IcSound, IcPlay, IcVerified } from '../components/Icons.jsx'

// ============ FULL-SCREEN REELS — inline styles (cascade-proof) ============
export default function Reels() {
  const app = useApp()
  const [reels, setReels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getReels(app.user.id)
      .then((list) => { setReels(list); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function patch(id, p) {
    setReels((l) => l.map((x) => (x.id === id ? p : x)))
  }

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        width: '100vw', height: '100vh', background: '#000', zIndex: 200,
        overflowY: 'scroll', scrollSnapType: 'y mandatory', WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none', overscrollBehavior: 'contain',
      }}
      className="reelsfx-scroller"
    >
      {loading && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: '#fff' }}>Loading…</div>
      )}
      {!loading && !reels.length && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', gap: 8 }}>
          <span style={{ fontSize: 44 }}>🎬</span>
          <h3 style={{ margin: 0 }}>No reels yet</h3>
          <p style={{ margin: 0, opacity: .7, fontSize: 14 }}>Tap + and share your first reel!</p>
        </div>
      )}
      {reels.map((r, i) => (
        <ReelItem key={r.id} reel={r} index={i} onChange={(p) => patch(r.id, p)} />
      ))}
    </div>
  )
}

function ReelItem({ reel, onChange, index = 0 }) {
  const app = useApp()
  const wrapRef = useRef(null)
  const vidRef = useRef(null)
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(true)
  const [showHeart, setShowHeart] = useState(false)
  const lastTap = useRef(0)

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

  async function like(forceLike = false) {
    if (forceLike && reel.likedByMe) return
    const next = !reel.likedByMe
    onChange({ ...reel, likedByMe: next, likes: reel.likes + (next ? 1 : -1) })
    if (next) buzz()
    try {
      const liked = await withTimeout(toggleLike(reel, app.user.id), 8000, 'Like')
      if (liked !== next) onChange({ ...reel, likedByMe: liked, likes: reel.likes + (liked ? 1 : -1) })
    } catch (e) {
      onChange(reel)
      app.toast(e.message)
    }
  }

  function tapMedia() {
    const now = Date.now()
    if (now - lastTap.current < 320) {
      lastTap.current = 0
      setShowHeart(true)
      setTimeout(() => setShowHeart(false), 700)
      like(true)
    } else {
      lastTap.current = now
      const v = vidRef.current
      if (v) {
        if (v.paused) { v.play().catch(() => {}); setPlaying(true) }
        else { v.pause(); setPlaying(false) }
      }
    }
  }

  async function share() {
    app.toast('Reel link copied 🔗')
    try { await navigator.clipboard.writeText(`${location.origin}/p/${reel.id}`) } catch {}
  }

  return (
    <div
      ref={wrapRef}
      className="reelsfx-item"
      style={{
        position: 'relative', width: '100vw', height: '100vh',
        flexShrink: 0, scrollSnapAlign: 'start', scrollSnapStop: 'always',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: '#000' }}>
        {reel.mediaType === 'video' ? (
          <video ref={vidRef} src={reel.media} loop muted={muted} playsInline onClick={tapMedia}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div className="reel-kenburns" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }} onClick={tapMedia}>
            <img src={reel.media} alt="" draggable="false" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        {reel.mediaType === 'video' && !playing && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.85)', pointerEvents: 'none' }}><IcPlay size={64} /></div>
        )}
        {reel.mediaType === 'video' && (
          <button className="icon-btn light" onClick={() => { setMuted((m) => !m); if (vidRef.current) vidRef.current.muted = !muted }}
            style={{ position: 'absolute', top: 'calc(14px + env(safe-area-inset-top, 0px))', right: 14, background: 'rgba(0,0,0,.5)', color: '#fff', zIndex: 5 }}>
            {muted ? <IcMute size={20} /> : <IcSound size={20} />}
          </button>
        )}
        {showHeart && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 6 }}>
            <span style={{ fontSize: 96, animation: 'heartPop .7s ease', color: '#ff3040', textShadow: '0 4px 24px rgba(0,0,0,.4)' }}>❤️</span>
          </div>
        )}
      </div>

      {/* bottom overlay */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 5,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        padding: '16px 16px calc(18px + env(safe-area-inset-bottom, 0px))',
        color: '#fff', background: 'linear-gradient(transparent, rgba(0,0,0,.55))',
      }}>
        <div style={{ maxWidth: '75%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to={'/' + reel.user.username}><Avatar user={reel.user} size={32} /></Link>
            <Link to={'/' + reel.user.username} style={{ fontWeight: 700, color: '#fff', textDecoration: 'none' }}>{reel.user.username}{reel.user.verified && <IcVerified size={13} style={{ marginLeft: 4, verticalAlign: -2 }} />}</Link>
            <FollowButton user={{ ...reel.user, isFollowing: false }} size="sm" onChange={(u) => onChange({ ...reel, user: { ...reel.user, ...u } })} />
          </div>
          <div style={{ fontSize: 14, textShadow: '0 1px 3px rgba(0,0,0,.4)', wordBreak: 'break-word' }}>{reel.caption}</div>
          <div style={{ fontSize: 12, opacity: .9 }}>♫ original audio — {reel.user.username}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
          <button className="reel-rail-btn" onClick={() => like()}>
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

      {index === 0 && (
        <div style={{ position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)', color: 'rgba(255,255,255,.6)', fontSize: 11, writingMode: 'vertical-rl', letterSpacing: 2, pointerEvents: 'none', zIndex: 5 }}>
          SWIPE UP
        </div>
      )}
    </div>
  )
}
