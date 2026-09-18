import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useApp } from '../store.jsx'
import { timeAgo, markStorySeen, sendMessage, addStoryToHighlight } from '../fb.js'
import Avatar from './Avatar.jsx'
import { IcVerified } from './Icons.jsx'
import { IcX, IcSend, IcChevronL, IcChevronR, IcBookmark } from './Icons.jsx'

const STORY_MS = 5000

export default function StoryViewer() {
  const app = useApp()
  const view = app.storyView
  const [gi, setGi] = useState(view?.index || 0)
  const [si, setSi] = useState(0)
  const [reply, setReply] = useState('')
  const [viewers, setViewers] = useState(null)
  const [viewersOpen, setViewersOpen] = useState(false)
  const [paused, setPaused] = useState(false)
  const timer = useRef(null)

  const close = useCallback(() => app.closeStories(), [app])

  useEffect(() => {
    if (!view) return
    setGi(view.index || 0)
    setSi(0)
  }, [view])

  const groups = view?.groups || []
  const group = groups[gi]

  const nextStory = useCallback(() => {
    if (!group) return
    if (si < group.stories.length - 1) setSi(si + 1)
    else if (gi < groups.length - 1) { setGi(gi + 1); setSi(0) }
    else close()
  }, [group, si, gi, groups.length, close])

  const prevStory = useCallback(() => {
    if (si > 0) setSi(si - 1)
    else if (gi > 0) { setGi(gi - 1); setSi(0) }
  }, [si, gi])

  useEffect(() => {
    if (!group) return
    const s = group.stories[si]
    if (!s) return
    markStorySeen(app.user.id, s.id).catch(() => {})
    clearTimeout(timer.current)
    if (!paused) timer.current = setTimeout(nextStory, STORY_MS)
    return () => clearTimeout(timer.current)
  }, [group, si, paused, nextStory])

  useEffect(() => {
    if (!view) return
    function onKey(e) {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') nextStory()
      if (e.key === 'ArrowLeft') prevStory()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [view, nextStory, prevStory, close])

  // view record + viewers (hooks BEFORE early returns — React rules)
  const curId = view && group ? group.stories[si]?.id : null
  useEffect(() => {
    if (!curId || !view || group.user.id === app.user.id) return
    addStoryView(curId, app.user.id).catch(() => {})
  }, [curId, view])
  useEffect(() => {
    if (!viewersOpen || !view) return
    getStoryViewers(group.stories[si]?.id).then(setViewers).catch(() => setViewers([]))
  }, [viewersOpen, si, view])

  if (!view || !group) return null
  const story = group.stories[si]
  if (!story) return null

  async function saveToHighlight() {
    try {
      await addStoryToHighlight(app.user, story)
      app.toast('Added to highlight ✨ (visible on your profile)')
    } catch (e) { app.toast(e.message) }
  }

  async function sendReply(e) {
    e.preventDefault()
    const text = reply.trim()
    if (!text) return
    try {
      await sendMessage(app.user.id, group.user.id, text)
      setReply('')
      app.toast('Reply sent to ' + group.user.username + ' ✉️')
    } catch (err) { app.toast(err.message) }
  }

  async function sendReaction(emoji) {
    try {
      await sendMessage(app.user.id, group.user.id, emoji)
      app.toast('Reaction sent ' + emoji)
    } catch (e) { app.toast(e.message) }
  }

  return (
    <div className="story-viewer" onMouseDown={() => setPaused(true)} onMouseUp={() => setPaused(false)}>
      <div className="story-header">
        <Avatar user={group.user} size={32} />
        <span className="story-h-username">{group.user.username}{group.user.verified && <IcVerified size={12} style={{ marginLeft: 4, verticalAlign: -2 }} />}</span>
        <span className="story-h-time">{timeAgo(story.createdAt)}</span>
        <div className="story-h-actions">
          {group.user.id === app.user.id && (
            <button className="icon-btn light" title="Add to highlight" onClick={saveToHighlight}><IcBookmark size={22} /></button>
          )}
          <button className="icon-btn light" onClick={close}><IcX size={26} /></button>
        </div>
      </div>

      <div className="story-progress">
        {group.stories.map((s, i) => (
          <div className="sp-track" key={s.id}>
            <div
              className="sp-fill"
              key={paused ? s.id + '-paused' : s.id}
              style={{
                animation: i < si ? 'none' : i === si ? `storyProgress ${STORY_MS}ms linear forwards ${paused ? 'paused' : 'running'}` : 'none',
                width: i < si ? '100%' : 0,
              }}
            />
          </div>
        ))}
      </div>

      <div className="story-stage" key={story.id}>
        {story.mediaType === 'video' ? (
          <video src={story.media} autoPlay muted playsInline onEnded={nextStory} />
        ) : (
          <img src={story.media} alt="story" draggable="false" />
        )}
      </div>

      <button className="story-tap left" onClick={prevStory} aria-label="Previous" />
      <button className="story-tap right" onClick={nextStory} aria-label="Next" />

      <button className="story-arrow left" onClick={prevStory}><IcChevronL size={20} /></button>
      <button className="story-arrow right" onClick={nextStory}><IcChevronR size={20} /></button>

      {group.user.id === app.user.id && (
        <button className="story-views-btn" onClick={(e) => { e.stopPropagation(); setViewersOpen(true) }}>
          👁 {Array.isArray(story.views) ? story.views.length : ''}
        </button>
      )}
      {viewersOpen && (
          <div className="sheet-backdrop" onClick={() => setViewersOpen(false)}>
            <div className="sheet" onClick={(e) => e.stopPropagation()}>
              <div className="ulist-head" style={{ justifyContent: 'center', padding: '12px 0 4px' }}><strong>Viewers</strong></div>
              {!viewers && <div className="modal-loading">Loading…</div>}
              {viewers && !viewers.length && <div className="pm-empty"><p style={{ margin: 0 }}>No viewers yet</p></div>}
              {viewers && viewers.map((u) => (
                <div className="rail-row" key={u.id}>
                  <Avatar user={u} size={40} />
                  <div className="rail-row-meta">
                    <span className="username">{u.username}</span>
                    <span className="muted">{u.name}</span>
                  </div>
                </div>
              ))}
              <button className="sheet-item" onClick={() => setViewersOpen(false)}>Close</button>
            </div>
          </div>
        )}
        {group.user.id !== app.user.id && (
        <div className="story-reactions">
          {['❤️', '😂', '😮', '😢', '🙌', '🔥'].map((e) => (
            <button key={e} type="button" onMouseDown={(ev) => ev.stopPropagation()} onClick={(ev) => { ev.stopPropagation(); sendReaction(e) }}>{e}</button>
          ))}
        </div>
        )}
      <form className="story-reply" onSubmit={sendReply}>
        <input
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder={`Reply to ${group.user.username}…`}
          onMouseDown={(e) => e.stopPropagation()}
        />
        {reply.trim() && <button type="submit" className="icon-btn light"><IcSend size={22} /></button>}
      </form>
    </div>
  )
}
