import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, timeAgo, formatCount } from '../api.js'
import { useApp } from '../store.jsx'
import Avatar from './Avatar.jsx'
import FollowButton from './FollowButton.jsx'
import { IcHeart, IcHeartFill, IcComment, IcSend, IcBookmark, IcBookmarkFill, IcDots, IcTrash, IcVerified } from './Icons.jsx'

export default function PostCard({ post, onChange, onDeleted }) {
  const app = useApp()
  const nav = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [showHeart, setShowHeart] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [following, setFollowing] = useState(post.user.isFollowing)
  const lastTap = useRef(0)
  const commentRef = useRef(null)
  const heartTimer = useRef(null)

  useEffect(() => () => clearTimeout(heartTimer.current), [])

  function patch(p) {
    onChange && onChange(p)
  }

  async function toggleLike(forceLike = false) {
    if (forceLike && post.likedByMe) return
    try {
      const r = await api(`/posts/${post.id}/like`, { method: 'POST' })
      patch({ ...post, likedByMe: r.liked, likes: r.likes })
    } catch (e) { app.toast(e.message) }
  }

  function onMediaClick() {
    const now = Date.now()
    if (now - lastTap.current < 350) {
      // double tap
      setShowHeart(true)
      clearTimeout(heartTimer.current)
      heartTimer.current = setTimeout(() => setShowHeart(false), 900)
      toggleLike(true)
    }
    lastTap.current = now
  }

  async function toggleSave() {
    try {
      const r = await api(`/posts/${post.id}/save`, { method: 'POST' })
      patch({ ...post, savedByMe: r.saved })
      app.toast(r.saved ? 'Saved to your collection 🔖' : 'Removed from saved')
    } catch (e) { app.toast(e.message) }
  }

  async function share() {
    const url = `${location.origin}/p/${post.id}`
    try {
      await navigator.clipboard.writeText(url)
      app.toast('Link copied to clipboard 🔗')
    } catch {
      app.toast(url)
    }
  }

  async function submitComment(e) {
    e.preventDefault()
    const text = commentText.trim()
    if (!text) return
    try {
      const r = await api(`/posts/${post.id}/comments`, { method: 'POST', body: { text } })
      patch({ ...post, comments: [...post.comments, r.comment], commentsCount: r.commentsCount })
      setCommentText('')
    } catch (e) { app.toast(e.message) }
  }

  async function deletePost() {
    setMenuOpen(false)
    try {
      await api(`/posts/${post.id}`, { method: 'DELETE' })
      app.toast('Post deleted')
      onDeleted && onDeleted(post.id)
    } catch (e) { app.toast(e.message) }
  }

  async function copyLinkMenu() {
    setMenuOpen(false)
    const url = `${location.origin}/p/${post.id}`
    try { await navigator.clipboard.writeText(url); app.toast('Link copied to clipboard 🔗') } catch { app.toast(url) }
  }

  const captionLines = post.caption || ''

  return (
    <article className="post-card">
      <header className="post-head">
        <div className="post-head-left">
          <Avatar
            user={post.user}
            size={34}
            ring
            seen={following}
            onClick={() => nav('/' + post.user.username)}
          />
          <div className="post-head-user">
            <Link to={'/' + post.user.username} className="post-username">
              {post.user.username}{(post.user.username === 'aarav_sharma') && <IcVerified size={13} style={{ marginLeft: 4, verticalAlign: -2 }} />}
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
        {showHeart && (
          <div className="big-heart">
            <IcHeartFill size={96} />
          </div>
        )}
      </div>

      <div className="post-actions">
        <div className="post-actions-left">
          <button className="icon-btn like-btn" onClick={() => toggleLike()} aria-label="Like">
            {post.likedByMe ? <IcHeartFill size={25} className="liked" /> : <IcHeart size={25} />}
          </button>
          <button className="icon-btn" onClick={() => commentRef.current?.focus()} aria-label="Comment"><IcComment size={25} /></button>
          <button className="icon-btn" onClick={share} aria-label="Share"><IcSend size={24} /></button>
        </div>
        <button className="icon-btn" onClick={toggleSave} aria-label="Save">
          {post.savedByMe ? <IcBookmarkFill size={24} /> : <IcBookmark size={24} />}
        </button>
      </div>

      <div className="post-body">
        <button className="likes-line" onClick={() => app.openPost(post.id)}>
          <strong>{formatCount(post.likes)} likes</strong>
        </button>
        {captionLines && (
          <div className="post-caption">
            <Link to={'/' + post.user.username} className="post-username">{post.user.username}</Link>{' '}
            <span className={'caption-text' + (expanded ? ' expanded' : '')}>{captionLines}</span>
            {!expanded && captionLines.length > 120 && (
              <button className="more-btn" onClick={() => setExpanded(true)}>more</button>
            )}
          </div>
        )}
        {post.commentsCount > 2 && (
          <button className="view-comments" onClick={() => app.openPost(post.id)}>
            View all {formatCount(post.commentsCount)} comments
          </button>
        )}
        {post.comments.slice(-2).map((c) => (
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
              <button className="sheet-item danger" onClick={deletePost}><IcTrash size={18} /> Delete</button>
            ) : (
              <>
                <button className="sheet-item danger" onClick={() => { setMenuOpen(false); app.toast('You unfollowed ' + post.user.username) }}>Unfollow</button>
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
