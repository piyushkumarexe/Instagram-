import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useApp } from '../store.jsx'
import { listUserConnections } from '../fb.js'
import Avatar from '../components/Avatar.jsx'
import FollowButton from '../components/FollowButton.jsx'
import { IcBack, IcVerified } from '../components/Icons.jsx'

// Full IG-style page: /:username/followers | /:username/following
export default function Connections() {
  const { username, kind } = useParams()
  const app = useApp()
  const nav = useNavigate()
  const activeKind = kind === 'following' ? 'following' : 'followers'
  const [users, setUsers] = useState(null)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')

  useEffect(() => {
    setUsers(null)
    setError('')
    listUserConnections(username, activeKind)
      .then(setUsers)
      .catch((e) => setError(e.message))
    window.scrollTo(0, 0)
  }, [username, activeKind])

  const filtered = (users || []).filter((u) =>
    !q.trim() ||
    u.username.includes(q.trim().toLowerCase()) ||
    (u.name || '').toLowerCase().includes(q.trim().toLowerCase())
  )

  return (
    <div className="conn-page">
      <header className="conn-head">
        <button className="icon-btn" onClick={() => nav(-1)}><IcBack size={24} /></button>
        <strong>{username}</strong>
      </header>
      <div className="conn-tabs">
        <button className={activeKind === 'followers' ? 'on' : ''} onClick={() => nav(`/${username}/followers`)}>Followers</button>
        <button className={activeKind === 'following' ? 'on' : ''} onClick={() => nav(`/${username}/following`)}>Following</button>
      </div>
      <div className="ulist-search">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" />
      </div>
      <div className="conn-body">
        {error && <div className="pm-empty"><span className="big-emoji">⚠️</span><h3>{error}</h3></div>}
        {!error && !users && <div className="modal-loading">Loading…</div>}
        {users && !filtered.length && (
          <div className="pm-empty"><span className="big-emoji">🙈</span><h3>{activeKind === 'followers' ? 'No followers yet' : 'Not following anyone yet'}</h3></div>
        )}
        {filtered.map((u) => (
          <div className="conn-row" key={u.id}>
            <Link to={'/' + u.username}><Avatar user={u} size={48} /></Link>
            <div className="conn-row-meta">
              <Link to={'/' + u.username} className="username">{u.username}{u.verified && <IcVerified size={12} style={{ marginLeft: 4 }} />}</Link>
              <span className="muted">{u.name}</span>
            </div>
            {u.id !== app.user.id && (
              <FollowButton user={u} size="sm" onChange={(nu) => setUsers((l) => l.map((x) => (x.id === nu.id ? nu : x)))} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
