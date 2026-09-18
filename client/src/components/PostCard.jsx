import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../store.jsx'
import { timeAgo, formatCount, toggleLike, toggleSave, addComment, deletePost as fbDeletePost } from '../fb.js'
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
    try {
      const liked = await toggleLike(post, app.user.id)
      onChange({ ...post, likedByMe: liked, likes: post.likes + (liked ? 1 : -1) })
    } catch (e) { app.toast(e.message) }
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

  async function share() {
    const url = `${location.origin}/p/${post.id}`
    try {
      await navigator.clipboard.writeText(url)
      app.toast('Link copied to clipboard 🔗')
    } catch { app.toast(url) }
  }

  async function submitComment(e) {
    e.preventDefault()
    const text = commentText.trim()
    if (!text) return
    try {
      const c = await addComment(app.user, post, text)
      onChange({ ...post, comments: [...post.comments, c], commentsCount: post.commentsCount + 1 })
      setCommentText('')
    } catch (e) { app.toast(e.message) }
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
          <button className="icon-btn" onClick={share} aria-label="Share"><IcSend size={24} /></button>
        </div>
        <button className="icon-btn" onClick={save} aria-label="Save">
          {post.savedByMe ? <IcBookmarkFill size={24} /> : <IcBookmark size={24} />}
        </button>
      </div>

      <div className="post-body">
        <button className="likes-line" onClick={() => app.openPost(post.id)}>
          <strong>{formatCount(post.likes)} likes</strong>
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
