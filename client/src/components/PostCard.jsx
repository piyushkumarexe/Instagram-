import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../store.jsx'
import { timeAgo, formatCount, toggleLike, toggleSave, addComment, deletePost as fbDeletePost, withTimeout, sendMessage, listUserConnections, buzz } from '../fb.js'
import Avatar from './Avatar.jsx'
import { IcHeart, IcHeartFill, IcComment, IcSend, IcBookmark, IcBookmarkFill, IcDots, IcTrash } from './Icons.jsx'

export default function PostCard({ post, onChange, onDeleted }) {
  const app = useApp()
  const nav = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [showHeart, setShowHeart] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [commentText, setCommentText] = useState('')
  const lastTap = useRef(0)
  const commentRef = useRef(null)
  const heartTimer = useRef(null)

  useEffect(() => () => clearTimeout(heartTimer.current), [])

  async function like(forceLike = false) {
    if (forceLike && post.likedByMe) return
    const next = !post.likedByMe
    onChange({ ...post, likedByMe: next, likes: post.likes + (next ? 1 : -1) }) // instant ❤️
    if (next) buzz()
    try {
      const liked = await withTimeout(toggleLike(post, app.user.id), 8000, 'Like')
      if (liked !== next) onChange({ ...post, likedByMe: liked, likes: post.likes + (liked ? 1 : -1) })
    } catch (e) {
      onChange(post) // revert
      app.toast(e.message)
    }
  }

  function onMediaClick() {
    const now = Date.now()
    if (now - lastTap.current < 350) {
      setShowHeart(true)
      clearTimeout(heartTimer.current)
      heartTimer.current = setTimeout(() => setShowHeart(false), 900)
      like(true)
    }
    lastTap.current = now
  }

  async function save() {
    try {
      const saved = await toggleSave(app.user.id, post)
      onChange({ ...post, savedByMe: saved })
      app.toast(saved ? 'Saved to your collection 🔖' : 'Removed from saved')
    } catch (e) { app.toast(e.message) }
  }

  const [shareOpen, setShareOpen] = useState(false)

  async function submitComment(e) {
    e.preventDefault()
    const text = commentText.trim()
    if (!text) return
    setCommentText('')
    const temp = { id: 'tmp-' + Date.now(), text, createdAt: Date.now(), user: { id: app.user.id, username: app.user.username, avatar: app.user.avatar || null } }
    const optimistic = { ...post, comments: [...post.comments, temp], commentsCount: post.commentsCount + 1 }
    onChange(optimistic) // instant 💬
    try {
      const c = await withTimeout(addComment(app.user, post, text), 8000, 'Comment')
      onChange({ ...optimistic, comments: [...post.comments, c] })
    } catch (err) {
      onChange(post) // revert
      app.toast(err.message)
    }
  }

  async function removePost() {
    setMenuOpen(false)
    try {
      await fbDeletePost(app.user.id, post)
      app.toast('Post deleted')
      onDeleted && onDeleted(post.id)
    } catch (e) { app.toast(e.message) }
  }

  async function copyLinkMenu() {
    setMenuOpen(false)
    const url = `${location.origin}/p/${post.id}`
    try { await navigator.clipboard.writeText(url); app.toast('Link copied to clipboard 🔗') } catch { app.toast(url) }
  }

  const caption = post.caption || ''

  return (
    <article className="post-card">
      <header className="post-head">
        <div className="post-head-left">
          <Avatar user={post.user} size={34} onClick={() => nav('/' + post.user.username)} />
          <div className="post-head-user">
            <Link to={'/' + post.user.username} className="post-username">
              {post.user.username}{post.user.username === 'aarav_sharma' && <IcVerified size={13} style={{ marginLeft: 4, verticalAlign: -2 }} />}
            </Link>
            <span className="post-time">• {timeAgo(post.createdAt)}</span>
          </div>
        </div>
        <button className="icon-btn" onClick={() => setMenuOpen(true)}><IcDots size={22} /></button>
      </header>

      <div className="post-media" onClick={onMediaClick}>
        {post.mediaType === 'video' ? (
          <video src={post.media} controls playsInline loop />
        ) : (
          <img src={post.media} alt={post.caption || 'post'} loading="lazy" draggable="false" />
        )}
        {post.type === 'reel' && <span className="reel-tag"><span className="reel-tag-icon">▶</span> Reel</span>}
        {showHeart && <div className="big-heart"><IcHeartFill size={96} /></div>}
      </div>

      <div className="post-actions">
        <div className="post-actions-left">
          <button className="icon-btn like-btn" onClick={() => like()} aria-label="Like">
            {post.likedByMe ? <IcHeartFill size={25} className="liked" /> : <IcHeart size={25} />}
          </button>
          <button className="icon-btn" onClick={() => commentRef.current?.focus()} aria-label="Comment"><IcComment size={25} /></button>
          <button className="icon-btn" onClick={() => setShareOpen(true)} aria-label="Share"><IcSend size={24} /></button>
        </div>
        <button className="icon-btn" onClick={save} aria-label="Save">
          {post.savedByMe ? <IcBookmarkFill size={24} /> : <IcBookmark size={24} />}
        </button>
      </div>

      <div className="post-body">
        <button className="likes-line" onClick={() => app.openPost(post.id)}>
          <strong>{formatCount(post.likes)} like{post.likes === 1 ? '' : 's'}</strong>
        </button>
        {caption && (
          <div className="post-caption">
            <Link to={'/' + post.user.username} className="post-username">{post.user.username}</Link>{' '}
            <span className={'caption-text' + (expanded ? ' expanded' : '')}>{caption}</span>
            {!expanded && caption.length > 120 && (
              <button className="more-btn" onClick={() => setExpanded(true)}>more</button>
            )}
          </div>
        )}
        {post.commentsCount > 0 && (
          <button className="view-comments" onClick={() => app.openPost(post.id)}>
            View all {formatCount(post.commentsCount)} comments
          </button>
        )}
        {post.comments.map((c) => (
          <div className="post-comment" key={c.id}>
            <Link to={'/' + c.user.username} className="post-username">{c.user.username}</Link>
            <span className="comment-text">{c.text}</span>
          </div>
        ))}
        <form className="add-comment" onSubmit={submitComment}>
          <input
            ref={commentRef}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment…"
          />
          {commentText.trim() && <button type="submit" className="post-btn-blue">Post</button>}
        </form>
      </div>

      {menuOpen && (
        <div className="sheet-backdrop" onClick={() => setMenuOpen(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            {post.user.id === app.user.id ? (
              <button className="sheet-item danger" onClick={removePost}><IcTrash size={18} /> Delete</button>
            ) : (
              <>
                <button className="sheet-item" onClick={copyLinkMenu}>Copy link</button>
                <button className="sheet-item" onClick={() => { setMenuOpen(false); nav('/messages/' + post.user.username) }}>Send message</button>
              </>
            )}
            <button className="sheet-item" onClick={() => setMenuOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
      {shareOpen && <ShareSheet post={post} onClose={() => setShareOpen(false)} />}
    </article>
  )
}

function IcVerified({ size, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <path fill="#0095f6" d="M12 1.5 14.8 4l3.7-.4 1 3.6 3.2 2-1.6 3.3 1.6 3.3-3.2 2-1 3.6-3.7-.4L12 23l-2.8-2.5-3.7.4-1-3.6-3.2-2L2.9 12 1.3 8.7l3.2-2 1-3.6L9.2 4z" />
      <path d="m8.3 12.3 2.4 2.4 5-5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}


// IG-style Share sheet: post ko DM se bhejo
function ShareSheet({ post, onClose }) {
  const app = useApp()
  const [list, setList] = useState(null)
  const [q, setQ] = useState('')
  const [sentTo, setSentTo] = useState([])

  useEffect(() => {
    listUserConnections(app.user.username, 'following')
      .then(setList)
      .catch(() => setList([]))
  }, [])

  async function send(u) {
    if (sentTo.includes(u.id)) return
    try {
      await sendMessage(app.user.id, u.id, `/p/${post.id}`)
      setSentTo((s) => [...s, u.id])
      app.toast('Shared with ' + u.username + ' \u2705')
    } catch (e) {
      app.toast(e.message)
    }
  }

  function copyLink() {
    const url = `${location.origin}/p/${post.id}`
    navigator.clipboard?.writeText(url).then(() => app.toast('Link copied \ud83d\udd17')).catch(() => app.toast(url))
  }

  const filtered = (list || []).filter((u) => !q.trim() || u.username.includes(q.trim().toLowerCase()) || (u.name || '').toLowerCase().includes(q.trim().toLowerCase()))

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="ulist-modal share-sheet" onClick={(e) => e.stopPropagation()}>
        <header className="ulist-head">
          <button className="icon-btn" onClick={onClose}><IcDots size={20} /></button>
          <strong>Share</strong>
          <span style={{ width: 40 }} />
        </header>
        <div className="ulist-search"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" autoFocus /></div>
        <div className="ulist-body">
          {!list && <div className="modal-loading">Loading…</div>}
          {list && !filtered.length && <div className="pm-empty"><p style={{ margin: 0 }}>Follow someone to share with them.</p></div>}
          {filtered.map((u) => (
            <div className="rail-row" key={u.id}>
              <Avatar user={u} size={44} />
              <div className="rail-row-meta">
                <span className="username">{u.username}</span>
                <span className="muted">{u.name}</span>
              </div>
              <button className={'btn ' + (sentTo.includes(u.id) ? 'btn-grey' : 'btn-blue') + ' btn-sm'} onClick={() => send(u)}>
                {sentTo.includes(u.id) ? 'Sent \u2713' : 'Send'}
              </button>
            </div>
          ))}
        </div>
        <div style={{ padding: 12, borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-grey" style={{ width: '100%' }} onClick={copyLink}>Copy link</button>
        </div>
      </div>
    </div>
  )
}
