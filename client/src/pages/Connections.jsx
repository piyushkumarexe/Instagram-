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
  // local tab state — instant switch, route bhi sync rehta hai
  const [active, setActive] = useState(kind === 'following' ? 'following' : 'followers')
  const [cache, setCache] = useState({}) // { followers: [...], following: [...] }
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')

  useEffect(() => {
    setActive(kind === 'following' ? 'following' : 'followers')
  }, [kind])

  useEffect(() => {
    if (cache[active]) return
    setLoading(true)
    setError('')
    listUserConnections(username, active)
      .then((users) => {
        setCache((c) => ({ ...c, [active]: users }))
        setLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setLoading(false)
      })
  }, [active, username])

  function switchTab(k) {
    setActive(k)
    nav(`/${username}/${k}`, { replace: true })
    window.scrollTo(0, 0)
  }

  function updateUser(nu) {
    setCache((c) => ({
      followers: (c.followers || []).map((x) => (x.id === nu.id ? nu : x)),
      following: (c.following || []).map((x) => (x.id === nu.id ? nu : x)),
    }))
  }

  const users = cache[active] || []
  const filtered = users.filter((u) =>
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
        <button className={active === 'followers' ? 'on' : ''} onClick={() => switchTab('followers')}>Followers</button>
        <button className={active === 'following' ? 'on' : ''} onClick={() => switchTab('following')}>Following</button>
      </div>
      <div className="ulist-search">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" />
      </div>
      <div className="conn-body">
        {error && <div className="pm-empty"><span className="big-emoji">⚠️</span><h3>{error}</h3></div>}
        {!error && (loading || !cache[active]) && <div className="modal-loading">Loading…</div>}
        {!error && cache[active] && !filtered.length && (
          <div className="pm-empty"><span className="big-emoji">🙈</span><h3>{active === 'followers' ? 'No followers yet' : 'Not following anyone yet'}</h3></div>
        )}
        {filtered.map((u) => (
          <div className="conn-row" key={u.id}>
            <Link to={'/' + u.username}><Avatar user={u} size={48} /></Link>
            <div className="conn-row-meta">
              <Link to={'/' + u.username} className="username">{u.username}{u.verified && <IcVerified size={12} style={{ marginLeft: 4 }} />}</Link>
              <span className="muted">{u.name}</span>
            </div>
            {u.id !== app.user.id && (
              <FollowButton user={u} size="sm" onChange={updateUser} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
