import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../store.jsx'
import { subscribeNotifications, markNotificationsRead, timeAgo, listRequests, acceptRequest, deleteRequest } from '../fb.js'
import Avatar from '../components/Avatar.jsx'
import FollowButton from '../components/FollowButton.jsx'
import { MobileTopBar } from '../components/MobileNav.jsx'
import PullToRefresh from '../components/PullToRefresh.jsx'

export default function Notifications() {
  const app = useApp()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [reqs, setReqs] = useState([])

  const loadReqs = useCallback(() => {
    listRequests(app.user.id).then(setReqs).catch(() => {})
  }, [])
  useEffect(() => { loadReqs() }, [loadReqs])

  async function acceptReq(r) {
    try {
      await acceptRequest(app.user, r.user)
      setReqs((l) => l.filter((x) => x.reqId !== r.reqId))
      app.toast(r.user.username + ' can now follow you ✅')
    } catch (e) { app.toast(e.message) }
  }
  async function declineReq(r) {
    try {
      await deleteRequest(r.reqId)
      setReqs((l) => l.filter((x) => x.reqId !== r.reqId))
    } catch (e) { app.toast(e.message) }
  }

  useEffect(() => {
    const unsub = subscribeNotifications(app.user.id, (list) => {
      setItems(list)
      setLoading(false)
    })
    return unsub
  }, [])

  async function markRead() {
    if (items.some((n) => !n.read)) {
      setItems((l) => l.map((n) => ({ ...n, read: true })))
      markNotificationsRead(app.user.id).catch(() => {})
    }
  }

  useEffect(() => { markRead() }, [items.length > 0])

  const groups = [
    { label: 'Today', filter: (n) => Date.now() - n.createdAt < 86400000 },
    { label: 'This week', filter: (n) => Date.now() - n.createdAt >= 86400000 && Date.now() - n.createdAt < 7 * 86400000 },
    { label: 'Earlier', filter: (n) => Date.now() - n.createdAt >= 7 * 86400000 },
  ]

  return (
    <div className="notif-page">
      <MobileTopBar title="Notifications" />
      <h2 className="page-title">Notifications</h2>
      <PullToRefresh onRefresh={() => new Promise((res) => setTimeout(res, 400))}>
      {!!reqs.length && (
        <section className="notif-group req-group">
          <h3>Follow requests</h3>
          {reqs.map((r) => (
            <div className="req-row" key={r.reqId}>
              <Link to={'/' + r.user.username}><Avatar user={r.user} size={44} /></Link>
              <div className="req-meta">
                <Link to={'/' + r.user.username} className="post-username">{r.user.username}</Link>
                <span className="muted">{r.user.name}</span>
              </div>
              <button className="btn btn-blue btn-sm" onClick={() => acceptReq(r)}>Confirm</button>
              <button className="btn btn-grey btn-sm" onClick={() => declineReq(r)}>Delete</button>
            </div>
          ))}
        </section>
      )}
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
                  {n.type === 'follow' && 'started following you.'}
                  {n.type === 'follow_accept' && 'accepted your follow request.'}
                  {n.type === 'follow_request' && 'requested to follow you.'}{' '}
                  <span className="muted">{timeAgo(n.createdAt)}</span>
                </p>
                {n.type === 'follow' ? (
                  <FollowButton user={{ ...n.actor, isFollowing: false }} size="sm" onChange={() => {}} />
                ) : n.postThumb ? (
                  <button className="notif-thumb" onClick={() => app.openPost(n.postId)}>
                    {n.postThumb.includes('.mp4') ? '▶' : <img src={n.postThumb} alt="" />}
                  </button>
                ) : null}
              </div>
            ))}
          </section>
        )
      })}
      </PullToRefresh>
    </div>
  )
}
