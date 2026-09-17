import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useApp } from '../store.jsx'
import { subscribeThreads, subscribeThread, sendMessage, markThreadRead, pairId, searchUsers, timeAgo } from '../fb.js'
import Avatar from '../components/Avatar.jsx'
import { IcDots, IcBack, IcNewMsg, IcSmile, IcX } from '../components/Icons.jsx'

const QUICK = ['❤️', '😂', '🔥', '👏', '😍', '🙏', '👍', '✨', '🎉', '😅']

export default function Messages() {
  const { username } = useParams()
  const app = useApp()
  const nav = useNavigate()
  const [threads, setThreads] = useState([])
  const [newOpen, setNewOpen] = useState(false)

  useEffect(() => {
    const unsub = subscribeThreads(app.user.id, setThreads)
    return unsub
  }, [])

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
          <input placeholder="Search" readOnly onClick={() => setNewOpen(true)} />
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
                  {t.last ? `${t.last.fromMe ? 'You: ' : ''}${(t.last.text || '').slice(0, 40)}` : 'Say hi 👋'}
                  {t.last?.createdAt ? ` · ${timeAgo(t.last.createdAt)}` : ''}
                </span>
              </div>
              {t.unread ? <span className="dm-unread-dot" /> : null}
            </Link>
          ))}
        </div>
      </div>
      <div className={'dm-thread-pane' + (username ? '' : ' hide-mobile')}>
        {username ? (
          <Chat username={username} />
        ) : (
          <div className="dm-empty-state">
            <div className="dm-empty-circle"><IcNewMsg size={44} /></div>
            <h3>Your messages</h3>
            <p>Send private messages to a friend.</p>
            <button className="btn btn-blue" onClick={() => setNewOpen(true)}>Send message</button>
          </div>
        )}
      </div>
      {newOpen && <NewMessage threads={threads} onClose={() => setNewOpen(false)} onPick={(u) => { setNewOpen(false); nav('/messages/' + u.username) }} />}
    </div>
  )
}

function NewMessage({ threads, onClose, onPick }) {
  const [q, setQ] = useState('')
  const [users, setUsers] = useState([])
  const [picked, setPicked] = useState(null)

  useEffect(() => {
    if (!q.trim()) { setUsers([]); return }
    const t = setTimeout(() => {
      searchUsers(q.trim()).then(setUsers).catch(() => {})
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
          {!q && <div className="pm-empty"><p style={{ margin: 0 }}>Type a name to search people…</p></div>}
        </div>
      </div>
    </div>
  )
}

function Chat({ username }) {
  const app = useApp()
  const nav = useNavigate()
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [emojiOpen, setEmojiOpen] = useState(false)
  const endRef = useRef(null)

  // resolve user by username (from cached threads first)
  useEffect(() => {
    let alive = true
    import('../fb.js').then(({ getUserByUsername }) => {
      getUserByUsername(username).then((u) => { if (alive) setUser(u) }).catch(() => {})
    })
    return () => { alive = false }
  }, [username])

  // realtime messages
  useEffect(() => {
    if (!user) return
    const pid = pairId(app.user.id, user.id)
    const unsub = subscribeThread(pid, setMessages)
    markThreadRead(pid, app.user.id).catch(() => {})
    return unsub
  }, [user?.id])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  async function send(e) {
    e.preventDefault()
    const t = text.trim()
    if (!t || !user) return
    setText('')
    try {
      await sendMessage(app.user.id, user.id, t)
    } catch (err) { app.toast(err.message); setText(t) }
  }

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
        <button className="icon-btn chat-back" onClick={() => nav('/messages')}><IcBack size={24} /></button>
        {user && (
          <Link to={'/' + user.username} className="chat-head-user">
            <Avatar user={user} size={32} />
            <strong>{user.username}</strong>
          </Link>
        )}
        <div style={{ flex: 1 }} />
        <button className="icon-btn" onClick={() => app.toast('Chat info coming soon')}><IcDots size={20} /></button>
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
            {g.msgs.map((m) => (
              <div key={m.id} className={'chat-row ' + (m.fromMe ? 'mine' : 'theirs')}>
                {!m.fromMe && <Avatar user={user} size={28} />}
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
          <button type="button" className="icon-btn" onClick={() => app.toast('Voice notes coming soon 🎙️')}><span className="mic-dot">🎤</span></button>
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
