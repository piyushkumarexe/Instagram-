import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, timeAgo, formatCount } from '../api.js'
import { useApp } from '../store.jsx'
import Avatar from './Avatar.jsx'
import FollowButton from './FollowButton.jsx'
import { IcX, IcHeart, IcHeartFill, IcDots, IcTrash, IcSend, IcBookmark, IcBookmarkFill } from './Icons.jsx'

export default function PostModal() {
  const app = useApp()
  const nav = useNavigate()
  const id = app.postModalId
  const [post, setPost] = useState(null)
  const [error, setError] = useState('')
  const [commentText, setCommentText] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    if (!id) { setPost(null); setError(''); return }
    api('/posts/' + id).then((r) => setPost(r.post)).catch((e) => setError(e.message))
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [id])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') app.closePost() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [app])

  if (!id) return null

  async function toggleLike() {
    if (!post) return
    const r = await api(`/posts/${post.id}/like`, { method: 'POST' })
    setPost({ ...post, likedByMe: r.liked, likes: r.likes })
  }
  async function toggleSave() {
    if (!post) return
    const r = await api(`/posts/${post.id}/save`, { method: 'POST' })
    setPost({ ...post, savedByMe: r.saved })
    app.toast(r.saved ? 'Saved 🔖' : 'Removed from saved')
  }
  async function submitComment(e) {
    e.preventDefault()
    if (!post || !commentText.trim()) return
    try {
      const r = await api(`/posts/${post.id}/comments`, { method: 'POST', body: { text: commentText.trim() } })
      setPost({ ...post, comments: [...post.comments, r.comment], commentsCount: r.commentsCount })
      setCommentText('')
      setTimeout(() => listRef.current?.scrollTo({ top: 1e6, behavior: 'smooth' }), 50)
    } catch (e2) { app.toast(e2.message) }
  }
  async function deleteComment(cid) {
    if (!post) return
    const r = await api(`/posts/${post.id}/comments/${cid}`, { method: 'DELETE' })
    setPost({ ...post, comments: post.comments.filter((c) => c.id !== cid), commentsCount: r.commentsCount })
  }
  async function deletePost() {
    try {
      await api(`/posts/${post.id}`, { method: 'DELETE' })
      app.toast('Post deleted')
      window.dispatchEvent(new Event('vg:refresh-feed'))
      app.closePost()
      nav(0)
    } catch (e) { app.toast(e.message) }
  }

  return (
    <div className="modal-backdrop" onClick={app.closePost}>
      <button className="modal-close" onClick={app.closePost}><IcX size={26} /></button>
      <div className="post-modal" onClick={(e) => e.stopPropagation()}>
        {!post && !error && <div className="modal-loading">Loading…</div>}
        {error && <div className="modal-loading">{error}</div>}
        {post && (
          <>
            <div className="pm-media">
              {post.mediaType === 'video' ? (
                <video src={post.media} controls autoPlay playsInline loop />
              ) : (
                <img src={post.media} alt={post.caption || 'post'} draggable="false" />
              )}
            </div>
            <div className="pm-side">
              <header className="pm-head">
                <Avatar user={post.user} size={32} onClick={() => { app.closePost(); nav('/' + post.user.username) }} />
                <Link to={'/' + post.user.username} className="post-username" onClick={app.closePost}>{post.user.username}</Link>
                <div style={{ flex: 1 }} />
                <button className="icon-btn" onClick={() => setMenuOpen(true)}><IcDots size={20} /></button>
              </header>
              <div className="pm-comments" ref={listRef}>
                {post.caption && (
                  <div className="pm-comment">
                    <Avatar user={post.user} size={32} />
                    <div className="pm-comment-body">
                      <Link to={'/' + post.user.username} className="post-username" onClick={app.closePost}>{post.user.username}</Link>
                      <span className="pm-comment-text"> {post.caption}</span>
                      <span className="pm-comment-time">{timeAgo(post.createdAt)}</span>
                    </div>
                  </div>
                )}
                {post.comments.map((c) => (
                  <div className="pm-comment" key={c.id}>
                    <Avatar user={c.user} size={32} onClick={() => { app.closePost(); nav('/' + c.user.username) }} />
                    <div className="pm-comment-body">
                      <Link to={'/' + c.user.username} className="post-username" onClick={app.closePost}>{c.user.username}</Link>
                      <span className="pm-comment-text"> {c.text}</span>
                      <div className="pm-comment-meta">
                        <span className="pm-comment-time">{timeAgo(c.createdAt)}</span>
                        {(c.user.id === app.user.id || post.user.id === app.user.id) && (
                          <button className="pm-del" onClick={() => deleteComment(c.id)}>Delete</button>
                        )}
                      </div>
                    </div>
                    <button className="icon-btn pm-like-sm" onClick={() => app.toast('Nice! ❤️')}><IcHeart size={12} /></button>
                  </div>
                ))}
                {!post.comments.length && !post.caption && (
                  <div className="pm-empty">
                    <span className="big-emoji">💬</span>
                    <h3>No comments yet</h3>
                    <p>Start the conversation.</p>
                  </div>
                )}
              </div>
              <div className="pm-actions">
                <div className="post-actions-left">
                  <button className="icon-btn" onClick={toggleLike}>{post.likedByMe ? <IcHeartFill size={24} className="liked" /> : <IcHeart size={24} />}</button>
                  <button className="icon-btn"><IcComment size={23} /></button>
                  <button className="icon-btn" onClick={async () => { try { await navigator.clipboard.writeText(`${location.origin}/p/${post.id}`); app.toast('Link copied 🔗') } catch {} }}><IcSend size={22} /></button>
                </div>
                <button className="icon-btn" onClick={toggleSave}>{post.savedByMe ? <IcBookmarkFill size={22} /> : <IcBookmark size={22} />}</button>
              </div>
              <div className="pm-likes"><strong>{formatCount(post.likes)} likes</strong></div>
              <div className="pm-ago">{timeAgo(post.createdAt)}</div>
              <form className="add-comment pm-add" onSubmit={submitComment}>
                <span className="pm-emoji"><IcHeart size={22} /></span>
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment…"
                />
                {commentText.trim() && <button type="submit" className="post-btn-blue">Post</button>}
              </form>
            </div>
          </>
        )}
        {menuOpen && post && (
          <div className="sheet-backdrop" onClick={() => setMenuOpen(false)}>
            <div className="sheet" onClick={(e) => e.stopPropagation()}>
              {post.user.id === app.user.id ? (
                <button className="sheet-item danger" onClick={() => { setMenuOpen(false); deletePost() }}><IcTrash size={18} /> Delete</button>
              ) : (
                <button className="sheet-item" onClick={() => { setMenuOpen(false); nav('/messages/' + post.user.username) }}>Send message</button>
              )}
              <button className="sheet-item" onClick={() => setMenuOpen(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
