import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, timeAgo } from '../api.js'
import { useApp } from '../store.jsx'
import Avatar from '../components/Avatar.jsx'
import FollowButton from '../components/FollowButton.jsx'
import { MobileTopBar } from '../components/MobileNav.jsx'
import { IcHeartFill, IcPlay } from '../components/Icons.jsx'

export default function Notifications() {
  const app = useApp()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/notifications')
      .then((r) => {
        setItems(r.notifications)
        setLoading(false)
        api('/notifications/read', { method: 'POST' }).then(() => app && null).catch(() => {})
      })
      .catch(() => setLoading(false))
  }, [])

  const groups = [
    { label: 'Today', filter: (n) => Date.now() - n.createdAt < 86400000 },
    { label: 'This week', filter: (n) => Date.now() - n.createdAt >= 86400000 && Date.now() - n.createdAt < 7 * 86400000 },
    { label: 'Earlier', filter: (n) => Date.now() - n.createdAt >= 7 * 86400000 },
  ]

  return (
    <div className="notif-page">
      <MobileTopBar title="Notifications" />
      <h2 className="page-title">Notifications</h2>
      {loading && <div className="modal-loading">Loading…</div>}
      {!loading && !items.length && (
        <div className="pm-empty"><span className="big-emoji">🔔</span><h3>No notifications yet</h3><p>When someone likes or comments on your posts, you'll see it here.</p></div>
      )}
      {groups.map((g) => {
        const list = items.filter(g.filter)
        if (!list.length) return null
        return (
          <section key={g.label} className="notif-group">
            <h3>{g.label}</h3>
            {list.map((n) => (
              <div key={n.id} className={'notif-row' + (n.read ? '' : ' unread')}>
                <Link to={'/' + n.actor.username}>
                  <Avatar user={n.actor} size={44} />
                </Link>
                <p className="notif-text">
                  <Link to={'/' + n.actor.username} className="post-username">{n.actor.username}</Link>{' '}
                  {n.type === 'like' && 'liked your post.'}
                  {n.type === 'comment' && 'commented on your post.'}
                  {n.type === 'follow' && 'started following you.'}{' '}
                  <span className="muted">{timeAgo(n.createdAt)}</span>
                </p>
                {n.type === 'follow' ? (
                  <FollowButton user={n.actor} size="sm" onChange={(u) => setItems((l) => l.map((x) => (x.id === n.id ? { ...x, actor: { ...x.actor, ...u } } : x)))} />
                ) : n.postThumb ? (
                  <button className="notif-thumb" onClick={() => app.openPost(n.postId)}>
                    {n.postThumb.includes('.mp4') ? <IcPlay size={20} /> : <img src={n.postThumb} alt="" />}
                  </button>
                ) : null}
              </div>
            ))}
          </section>
        )
      })}
    </div>
  )
}
