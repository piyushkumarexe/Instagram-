import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api, timeAgo } from '../api.js'
import { useApp } from '../store.jsx'
import Avatar from '../components/Avatar.jsx'
import { IcDots, IcBack, IcNewMsg, IcSmile, IcX } from '../components/Icons.jsx'

const QUICK = ['❤️', '😂', '🔥', '👏', '😍', '🙏', '👍', '✨', '🎉', '😅']

export default function Messages() {
  const { username } = useParams()
  const app = useApp()
  const nav = useNavigate()
  const [threads, setThreads] = useState([])
  const [newOpen, setNewOpen] = useState(false)

  const loadThreads = useCallback(async () => {
    try {
      const r = await api('/messages')
      setThreads(r.threads)
      app.setUnreadDMs(r.threads.reduce((a, t) => a + (t.unread || 0), 0))
    } catch (e) {}
  }, [])

  useEffect(() => {
    loadThreads()
    const iv = setInterval(loadThreads, 8000)
    return () => clearInterval(iv)
  }, [loadThreads])

  return (
    <div className="dm-page">
      <div className={'dm-list' + (username ? ' hide-mobile' : '')}>
        <header className="dm-list-head">
          <div className="dm-me" onClick={() => nav('/' + app.user.username)}>
            <strong>{app.user.username}</strong>
          </div>
          <button className="icon-btn" onClick={() => setNewOpen(true)}><IcNewMsg size={24} /></button>
        </header>
        <div className="dm-search">
          <input placeholder="Search" />
        </div>
        <div className="dm-threads">
          {!threads.length && (
            <div className="pm-empty"><span className="big-emoji">✉️</span><h3>No messages yet</h3><p>Tap the ✏️ icon to start a chat.</p></div>
          )}
          {threads.map((t) => (
            <Link key={t.user.id} to={'/messages/' + t.user.username} className={'dm-thread' + (username === t.user.username ? ' active' : '') + (t.unread ? ' unread' : '')}>
              <Avatar user={t.user} size={56} />
              <div className="dm-thread-meta">
                <span className="username">{t.user.username}</span>
                <span className={'dm-preview muted' + (t.unread ? ' strong' : '')}>
                  {t.last ? `${t.last.fromMe ? 'You: ' : ''}${t.last.text.slice(0, 40)}` : 'Say hi 👋'}
                  {t.last ? ` · ${timeAgo(t.last.createdAt)}` : ''}
                </span>
              </div>
              {t.unread ? <span className="dm-unread-dot" /> : null}
            </Link>
          ))}
        </div>
      </div>
      <div className={'dm-thread-pane' + (username ? '' : ' hide-mobile')}>
        {username ? (
          <Chat username={username} onThreadsChange={loadThreads} />
        ) : (
          <div className="dm-empty-state">
            <div className="dm-empty-circle"><IcNewMsg size={44} /></div>
            <h3>Your messages</h3>
            <p>Send private photos and messages to a friend or group.</p>
            <button className="btn btn-blue" onClick={() => setNewOpen(true)}>Send message</button>
          </div>
        )}
      </div>
      {newOpen && <NewMessage threads={threads} onClose={() => setNewOpen(false)} onPick={(u) => { setNewOpen(false); nav('/messages/' + u.username) }} />}
    </div>
  )
}

function NewMessage({ threads, onClose, onPick }) {
  const app = useApp()
  const [q, setQ] = useState('')
  const [users, setUsers] = useState([])
  const [picked, setPicked] = useState(null)

  useEffect(() => {
    if (!q.trim()) {
      api('/users/suggestions').then((r) => setUsers(r.users)).catch(() => {})
      return
    }
    const t = setTimeout(() => {
      api('/users/search?q=' + encodeURIComponent(q.trim())).then((r) => setUsers(r.users)).catch(() => {})
    }, 250)
    return () => clearTimeout(t)
  }, [q])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="ulist-modal newmsg" onClick={(e) => e.stopPropagation()}>
        <header className="ulist-head">
          <button className="icon-btn" onClick={onClose}><IcX size={20} /></button>
          <strong>New message</strong>
          <button className="blue-link" style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }} disabled={!picked} onClick={() => picked && onPick(picked)}>Chat</button>
        </header>
        <div className="ulist-search to-row">
          <span className="muted strong">To:</span>
          {picked && (
            <span className="picked-chip" onClick={() => setPicked(null)}>
              <Avatar user={picked} size={20} /> {picked.username} <IcX size={12} />
            </span>
          )}
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" autoFocus />
        </div>
        <div className="ulist-body">
          {users.filter((u) => !picked || u.id !== picked.id).map((u) => (
            <div className="rail-row" key={u.id} onClick={() => setPicked(u)} style={{ cursor: 'pointer' }}>
              <Avatar user={u} size={44} />
              <div className="rail-row-meta">
                <span className="username">{u.username}</span>
                <span className="muted">{u.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Chat({ username, onThreadsChange }) {
  const app = useApp()
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [emojiOpen, setEmojiOpen] = useState(false)
  const endRef = useRef(null)

  const load = useCallback(async () => {
    try {
      const r = await api('/messages/' + username)
      setUser(r.user)
      setMessages(r.messages)
    } catch (e) { app.toast(e.message) }
  }, [username])

  useEffect(() => {
    load()
    const iv = setInterval(load, 3000)
    return () => clearInterval(iv)
  }, [load])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  async function send(e) {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    setText('')
    try {
      const r = await api('/messages', { method: 'POST', body: { to: username, text: t } })
      setMessages((m) => [...m, r.message])
      onThreadsChange && onThreadsChange()
    } catch (err) { app.toast(err.message); setText(t) }
  }

  // group by day
  const groups = []
  for (const m of messages) {
    const d = new Date(m.createdAt)
    const key = d.toDateString()
    const last = groups[groups.length - 1]
    if (last && last.key === key) last.msgs.push(m)
    else groups.push({ key, label: dayLabel(d), msgs: [m] })
  }

  return (
    <>
      <header className="chat-head">
        <button className="icon-btn chat-back" onClick={() => { nav('/messages'); onThreadsChange() }}><IcBack size={24} /></button>
        {user && (
          <Link to={'/' + user.username} className="chat-head-user">
            <Avatar user={user} size={32} />
            <strong>{user.username}</strong>
          </Link>
        )}
        <div style={{ flex: 1 }} />
        <button className="icon-btn" onClick={() => app.toast('Chat info (demo)')}><IcDots size={20} /></button>
      </header>

      <div className="chat-body">
        {user && (
          <div className="chat-intro">
            <Avatar user={user} size={72} />
            <strong>{user.name}</strong>
            <span className="muted">{user.username} · VibeGram</span>
            <Link to={'/' + user.username} className="btn btn-grey btn-sm">View profile</Link>
          </div>
        )}
        {groups.map((g) => (
          <div key={g.key} className="chat-day">
            <div className="chat-day-label">{g.label}</div>
            {g.msgs.map((m, i) => (
              <div key={m.id} className={'chat-row ' + (m.fromMe ? 'mine' : 'theirs')}>
                {!m.fromMe && <Avatar user={user} size={28} style={{ visibility: g.msgs[i + 1]?.fromMe ? 'hidden' : 'visible' }} />}
                <div className={'bubble' + (m.fromMe ? ' mine' : '')} title={new Date(m.createdAt).toLocaleString()}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form className="chat-input" onSubmit={send}>
        {emojiOpen && (
          <div className="emoji-pop">
            {QUICK.map((e) => (
              <button type="button" key={e} onClick={() => setText((t) => t + e)}>{e}</button>
            ))}
          </div>
        )}
        <button type="button" className="icon-btn" onClick={() => setEmojiOpen((o) => !o)}><IcSmile size={24} /></button>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Message…" />
        {text.trim() ? (
          <button type="submit" className="chat-send">Send</button>
        ) : (
          <button type="button" className="icon-btn" onClick={() => { app.toast('Voice notes coming soon 🎙️') }}><IcSmile size={0} style={{ display: 'none' }} /><span className="mic-dot">🎤</span></button>
        )}
      </form>
    </>
  )
}

function dayLabel(d) {
  const today = new Date().toDateString()
  const yest = new Date(Date.now() - 86400000).toDateString()
  if (d.toDateString() === today) return 'Today'
  if (d.toDateString() === yest) return 'Yesterday'
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}
