import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../store.jsx'
import { timeAgo, formatCount, getPost, getComments, toggleLike, toggleSave, addComment, deleteComment, likeComment, updateCaption, deletePost as fbDeletePost, withTimeout } from '../fb.js'
import Avatar from './Avatar.jsx'
import { IcX, IcHeart, IcHeartFill, IcComment, IcDots, IcTrash, IcSend, IcBookmark, IcBookmarkFill, IcVerified } from './Icons.jsx'
import RichText from './RichText.jsx'

export default function PostModal() {
  const app = useApp()
  const nav = useNavigate()
  const id = app.postModalId
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [error, setError] = useState('')
  const [commentText, setCommentText] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [openReplies, setOpenReplies] = useState({})
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
      const c = await withTimeout(addComment(app.user, post, commentText.trim(), replyTo), 8000, 'Comment')
      setComments((l) => [...l, c])
      setReplyTo(null)
      setPost({ ...post, commentsCount: post.commentsCount + 1 })
      setCommentText('')
      setTimeout(() => listRef.current?.scrollTo({ top: 1e6, behavior: 'smooth' }), 50)
    } catch (e2) { app.toast(e2.message) }
  }
  async function likeC(c) {
    const uid = app.user.id
    const liked = (c.likes || []).includes(uid)
    // optimistic
    setComments((l) => l.map((x) => x.id === c.id ? { ...x, likes: liked ? x.likes.filter((i) => i !== uid) : [...(x.likes || []), uid], likesCount: x.likesCount + (liked ? -1 : 1) } : x))
    try {
      await withTimeout(likeComment(post.id, c, uid), 8000, 'Like')
    } catch (e) {
      setComments((l) => l.map((x) => x.id === c.id ? { ...x, likes: c.likes || [], likesCount: c.likesCount || 0 } : x))
      app.toast(e.message)
    }
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
                <Link to={'/' + post.user.username} className="post-username" onClick={app.closePost}>{post.user.username}{post.user.verified && <IcVerified size={13} style={{ marginLeft: 4, verticalAlign: -2 }} />}</Link>
                <div style={{ flex: 1 }} />
                <button className="icon-btn" onClick={() => setMenuOpen(true)}><IcDots size={20} /></button>
              </header>
              <div className="pm-comments" ref={listRef}>
                {post.caption && (
                  <div className="pm-comment">
                    <Avatar user={post.user} size={32} />
                    <div className="pm-comment-body">
                      <Link to={'/' + post.user.username} className="post-username" onClick={app.closePost}>{post.user.username}{post.user.verified && <IcVerified size={12} style={{ marginLeft: 4, verticalAlign: -2 }} />}</Link>
                      <span className="pm-comment-text"> <RichText text={post.caption} onNav={app.closePost} /></span>
                      <span className="pm-comment-time">{timeAgo(post.createdAt)}</span>
                    </div>
                  </div>
                )}
                {comments.filter((c) => !c.parentId).map((c) => {
                  const replies = comments.filter((r) => r.parentId === c.id)
                  const liked = (c.likes || []).includes(app.user.id)
                  return (
                    <React.Fragment key={c.id}>
                      <div className="pm-comment">
                        <Avatar user={c.user} size={32} onClick={() => { app.closePost(); nav('/' + c.user.username) }} />
                        <div className="pm-comment-body">
                          <Link to={'/' + c.user.username} className="post-username" onClick={app.closePost}>{c.user.username}{c.user.verified && <IcVerified size={12} style={{ marginLeft: 4, verticalAlign: -2 }} />}</Link>
                          <span className="pm-comment-text"> <RichText text={c.text} onNav={app.closePost} /></span>
                          <div className="pm-comment-meta">
                            <span className="pm-comment-time">{timeAgo(c.createdAt)}</span>
                            <button className="pm-del" onClick={() => setReplyTo(c)}>Reply</button>
                            {(c.user.id === app.user.id || post.user.id === app.user.id) && (
                              <button className="pm-del" onClick={() => removeComment(c.id)}>Delete</button>
                            )}
                            {replies.length > 0 && (
                              <button className="pm-del strong" onClick={() => setOpenReplies((o) => ({ ...o, [c.id]: !o[c.id] }))}>
                                {openReplies[c.id] ? 'Hide replies' : `View replies (${replies.length})`}
                              </button>
                            )}
                          </div>
                          {openReplies[c.id] && replies.map((r) => {
                            const rLiked = (r.likes || []).includes(app.user.id)
                            return (
                              <div className="pm-comment reply" key={r.id}>
                                <Avatar user={r.user} size={24} onClick={() => { app.closePost(); nav('/' + r.user.username) }} />
                                <div className="pm-comment-body">
                                  <Link to={'/' + r.user.username} className="post-username" onClick={app.closePost}>{r.user.username}{r.user.verified && <IcVerified size={11} style={{ marginLeft: 4, verticalAlign: -2 }} />}</Link>
                                  <span className="pm-comment-text"> <RichText text={r.text} onNav={app.closePost} /></span>
                                  <div className="pm-comment-meta">
                                    <span className="pm-comment-time">{timeAgo(r.createdAt)}</span>
                                    <button className="pm-del" onClick={() => setReplyTo(c)}>Reply</button>
                                  </div>
                                </div>
                                <button className={'icon-btn pm-like-sm' + (rLiked ? ' on' : '')} onClick={() => likeC(r)}>
                                  {rLiked ? <IcHeartFill size={12} /> : <IcHeart size={12} />}
                                  {r.likesCount > 0 && <em>{r.likesCount}</em>}
                                </button>
                              </div>
                            )
                          })}
                        </div>
                        <button className={'icon-btn pm-like-sm' + (liked ? ' on' : '')} onClick={() => likeC(c)}>
                          {liked ? <IcHeartFill size={12} /> : <IcHeart size={12} />}
                          {c.likesCount > 0 && <em>{c.likesCount}</em>}
                        </button>
                      </div>
                    </React.Fragment>
                  )
                })}
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
              <div className="pm-likes"><strong>{formatCount(post.likes)} like{post.likes === 1 ? '' : 's'}</strong></div>
              <div className="pm-ago">{timeAgo(post.createdAt)}</div>
              <form className="add-comment pm-add" onSubmit={submitComment}>
                <span className="pm-emoji"><IcHeart size={22} /></span>
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={replyTo ? `Reply to @${replyTo.user.username}…` : 'Add a comment…'}
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
                <>
                  <button className="sheet-item" onClick={async () => {
                    setMenuOpen(false)
                    const nc = window.prompt('Edit caption', post.caption || '')
                    if (nc === null) return
                    try {
                      const clean = await withTimeout(updateCaption(app.user.id, post, nc), 8000, 'Save')
                      setPost({ ...post, caption: clean })
                      app.toast('Caption updated ✅')
                      window.dispatchEvent(new Event('vg:refresh-feed'))
                    } catch (e) { app.toast(e.message) }
                  }}>✏️ Edit caption</button>
                  <button className="sheet-item danger" onClick={() => { setMenuOpen(false); removePost() }}><IcTrash size={18} /> Delete</button>
                </>
              ) : (
                <button className="sheet-item" onClick={() => { setMenuOpen(false); nav('/messages/' + post.user.username) }}>Send message</button>
              )}
              <button className="sheet-item" onClick={async () => {
                setMenuOpen(false)
                const url = `${location.origin}/p/${post.id}`
                try { await navigator.clipboard.writeText(url); app.toast('Link copied 🔗') } catch { app.toast(url) }
              }}>🔗 Copy link</button>
              <button className="sheet-item" onClick={() => setMenuOpen(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
