import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../store.jsx'
import { timeAgo, formatCount, getPost, getComments, toggleLike, toggleSave, addComment, deleteComment, deletePost as fbDeletePost } from '../fb.js'
import Avatar from './Avatar.jsx'
import { IcX, IcHeart, IcHeartFill, IcDots, IcTrash, IcSend, IcBookmark, IcBookmarkFill } from './Icons.jsx'

export default function PostModal() {
  const app = useApp()
  const nav = useNavigate()
  const id = app.postModalId
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [error, setError] = useState('')
  const [commentText, setCommentText] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    if (!id) { setPost(null); setError(''); setComments([]); return }
    Promise.all([getPost(id), getComments(id).catch(() => [])])
      .then(([p, cs]) => {
        if (!p) setError('Post not found')
        setPost(p)
        setComments(cs)
      })
      .catch((e) => setError(e.message))
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [id])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') app.closePost() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [app])

  if (!id) return null

  async function like() {
    if (!post) return
    const liked = await toggleLike(post, app.user.id)
    setPost({ ...post, likedByMe: liked, likes: post.likes + (liked ? 1 : -1) })
  }
  async function save() {
    if (!post) return
    const saved = await toggleSave(app.user.id, post)
    setPost({ ...post, savedByMe: saved })
    app.toast(saved ? 'Saved 🔖' : 'Removed from saved')
  }
  async function submitComment(e) {
    e.preventDefault()
    if (!post || !commentText.trim()) return
    try {
      const c = await addComment(app.user, post, commentText.trim())
      setComments((l) => [...l, c])
      setPost({ ...post, commentsCount: post.commentsCount + 1 })
      setCommentText('')
      setTimeout(() => listRef.current?.scrollTo({ top: 1e6, behavior: 'smooth' }), 50)
    } catch (e2) { app.toast(e2.message) }
  }
  async function removeComment(cid) {
    if (!post) return
    const c = comments.find((x) => x.id === cid)
    await deleteComment(app.user.id, post, c)
    setComments((l) => l.filter((x) => x.id !== cid))
    setPost({ ...post, commentsCount: Math.max(0, post.commentsCount - 1) })
  }
  async function removePost() {
    try {
      await fbDeletePost(app.user.id, post)
      app.toast('Post deleted')
      window.dispatchEvent(new Event('vg:refresh-feed'))
      app.closePost()
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
                {comments.map((c) => (
                  <div className="pm-comment" key={c.id}>
                    <Avatar user={c.user} size={32} onClick={() => { app.closePost(); nav('/' + c.user.username) }} />
                    <div className="pm-comment-body">
                      <Link to={'/' + c.user.username} className="post-username" onClick={app.closePost}>{c.user.username}</Link>
                      <span className="pm-comment-text"> {c.text}</span>
                      <div className="pm-comment-meta">
                        <span className="pm-comment-time">{timeAgo(c.createdAt)}</span>
                        {(c.user.id === app.user.id || post.user.id === app.user.id) && (
                          <button className="pm-del" onClick={() => removeComment(c.id)}>Delete</button>
                        )}
                      </div>
                    </div>
                    <button className="icon-btn pm-like-sm" onClick={() => app.toast('Nice! ❤️')}><IcHeart size={12} /></button>
                  </div>
                ))}
                {!comments.length && !post.caption && (
                  <div className="pm-empty">
                    <span className="big-emoji">💬</span>
                    <h3>No comments yet</h3>
                    <p>Start the conversation.</p>
                  </div>
                )}
              </div>
              <div className="pm-actions">
                <div className="post-actions-left">
                  <button className="icon-btn" onClick={like}>{post.likedByMe ? <IcHeartFill size={24} className="liked" /> : <IcHeart size={24} />}</button>
                  <button className="icon-btn"><IcComment size={23} /></button>
                  <button className="icon-btn" onClick={async () => { try { await navigator.clipboard.writeText(`${location.origin}/p/${post.id}`); app.toast('Link copied 🔗') } catch {} }}><IcSend size={22} /></button>
                </div>
                <button className="icon-btn" onClick={save}>{post.savedByMe ? <IcBookmarkFill size={22} /> : <IcBookmark size={22} />}</button>
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
                <button className="sheet-item danger" onClick={() => { setMenuOpen(false); removePost() }}><IcTrash size={18} /> Delete</button>
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
