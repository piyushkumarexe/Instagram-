import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../store.jsx'
import { suggestions } from '../fb.js'
import Avatar from './Avatar.jsx'
import FollowButton from './FollowButton.jsx'

export default function Suggestions() {
  const app = useApp()
  const [users, setUsers] = useState([])

  useEffect(() => {
    let alive = true
    suggestions(app.user.id).then((r) => alive && setUsers(r)).catch(() => {})
    return () => { alive = false }
  }, [])

  function onFollow(u) {
    setUsers((list) => list.filter((x) => x.id !== u.id))
  }

  return (
    <aside className="rail">
      <div className="rail-me">
        <Link to={'/' + app.user.username}><Avatar user={app.user} size={44} /></Link>
        <div className="rail-me-meta">
          <Link to={'/' + app.user.username} className="username">{app.user.username}</Link>
          <span className="muted">{app.user.name}</span>
        </div>
        <button className="rail-switch" onClick={() => app.toast('Already switched to you 😉')}>Switch</button>
      </div>

      <div className="rail-sec-head">
        <span className="muted strong">Suggested for you</span>
        {users.length > 0 && <Link to="/explore" className="see-all">See All</Link>}
      </div>
      <div className="rail-list">
        {users.map((u) => (
          <div className="rail-row" key={u.id}>
            <Link to={'/' + u.username}><Avatar user={u} size={32} /></Link>
            <div className="rail-row-meta">
              <Link to={'/' + u.username} className="username">{u.username}</Link>
              <span className="muted">Suggested for you</span>
            </div>
            <FollowButton user={u} size="sm" onChange={onFollow} />
          </div>
        ))}
      </div>

      <div className="rail-footer">
        <p>About · Help · Press · API · Jobs · Privacy · Terms</p>
        <p>Locations · Language</p>
        <p className="muted">© 2026 Instagram 2.0 — powered by Firebase</p>
      </div>
    </aside>
  )
}
