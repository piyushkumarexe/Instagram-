import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../store.jsx'
import { listUserConnections } from '../fb.js'
import Avatar from './Avatar.jsx'
import FollowButton from './FollowButton.jsx'
import { IcX } from './Icons.jsx'

// userState: {title, username, kind: 'followers'|'following'}
export default function UserListModal({ userState, onClose }) {
  const app = useApp()
  const [users, setUsers] = useState(null)
  const [q, setQ] = useState('')

  useEffect(() => {
    if (!userState) return
    setUsers(null)
    listUserConnections(userState.username, userState.kind)
      .then(setUsers)
      .catch((e) => { app.toast(e.message); onClose() })
  }, [userState])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!userState) return null

  const filtered = (users || []).filter((u) => !q.trim() || u.username.includes(q.trim().toLowerCase()) || (u.name || '').toLowerCase().includes(q.trim().toLowerCase()))

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="ulist-modal" onClick={(e) => e.stopPropagation()}>
        <header className="ulist-head">
          <span />
          <strong>{userState.title}</strong>
          <button className="icon-btn" onClick={onClose}><IcX size={22} /></button>
        </header>
        <div className="ulist-search">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" />
        </div>
        <div className="ulist-body">
          {!users && <div className="modal-loading">Loading…</div>}
          {users && !filtered.length && <div className="pm-empty"><span className="big-emoji">🙈</span><h3>No users found</h3></div>}
          {filtered.map((u) => (
            <div className="rail-row" key={u.id}>
              <Link to={'/' + u.username} onClick={onClose}><Avatar user={u} size={44} /></Link>
              <div className="rail-row-meta">
                <Link to={'/' + u.username} className="username" onClick={onClose}>{u.username}</Link>
                <span className="muted">{u.name}</span>
              </div>
              {u.id !== app.user.id && <FollowButton user={u} size="sm" onChange={(nu) => setUsers((l) => l.map((x) => (x.id === nu.id ? nu : x)))} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
