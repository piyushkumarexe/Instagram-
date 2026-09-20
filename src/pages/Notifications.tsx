import { memo, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { AppNotification, Post, User } from '../types'
import { StaticAvatar } from '../components/ZoomablePhoto'
import { useDispatch } from '../store/AppContext'
import { timeAgo } from '../data/seed'

export interface NotificationsProps {
  items: AppNotification[]
  byId: Map<string, User>
  posts: Post[]
  nameOf: (id: string) => string
}

const DAY = 86_400_000

const VERB: Record<AppNotification['kind'], string> = {
  like: 'liked your post.',
  comment: 'commented:',
  follow: 'started following you.',
  mention: 'mentioned you in a comment:',
  tag: 'tagged you in a post',
}

function NotificationsInner({ items, byId, posts }: NotificationsProps) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // opening the tab clears the badge, like Instagram
  useEffect(() => {
    if (items.some((n) => !n.read)) {
      const t = window.setTimeout(() => dispatch({ type: 'markNotificationsRead' }), 900)
      return () => window.clearTimeout(t)
    }
  }, [dispatch, items])

  const groups = useMemo(() => {
    const now = Date.now()
    const buckets: { title: string; items: AppNotification[] }[] = [
      { title: 'New', items: [] },
      { title: 'Today', items: [] },
      { title: 'This week', items: [] },
      { title: 'Earlier', items: [] },
    ]
    for (const n of [...items].sort((a, b) => b.createdAt - a.createdAt)) {
      const age = now - n.createdAt
      if (!n.read) buckets[0].items.push(n)
      else if (age < DAY) buckets[1].items.push(n)
      else if (age < 7 * DAY) buckets[2].items.push(n)
      else buckets[3].items.push(n)
    }
    return buckets.filter((b) => b.items.length)
  }, [items])

  return (
    <div className="content" style={{ maxWidth: 600 }}>
      <div className="section-head">
        <span style={{ fontSize: 16 }}>Notifications</span>
        <button type="button" className="link-blue small" onClick={() => dispatch({ type: 'markNotificationsRead' })}>
          Mark all read
        </button>
      </div>
      {groups.map((g) => (
        <section key={g.title}>
          <div className="group-title">{g.title}</div>
          {g.items.map((n) => {
            const u = byId.get(n.userId)
            const post = n.postId ? posts.find((p) => p.id === n.postId) : undefined
            return (
              <div
                className={`notif ${n.read ? '' : 'is-unread'}`}
                key={n.id}
                role="link"
                tabIndex={0}
                onClick={() => (post ? navigate(`/p/${post.id}`) : u ? navigate(`/${u.username}`) : undefined)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') post ? navigate(`/p/${post.id}`) : u ? navigate(`/${u.username}`) : undefined
                }}
              >
                <StaticAvatar src={u?.avatar ?? ''} alt={u?.username ?? ''} size={44} />
                <span className="notif__text">
                  <span className="bold">{u?.username}</span> {VERB[n.kind]}{' '}
                  {n.text ? <span className="muted">{n.text}</span> : null}{' '}
                  <span className="muted">{timeAgo(n.createdAt)}</span>
                </span>
                {n.kind === 'follow' ? (
                  <button
                    type="button"
                    className="btn btn--primary btn--sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (u) dispatch({ type: 'toggleFollow', userId: u.id })
                    }}
                  >
                    {u?.isFollowing ? 'Following' : 'Follow'}
                  </button>
                ) : post ? (
                  <img className="notif__thumb" src={post.media[0].src} alt="" loading="lazy" decoding="async" />
                ) : null}
              </div>
            )
          })}
        </section>
      ))}
    </div>
  )
}

const Notifications = memo(NotificationsInner)
export default Notifications
