import { memo, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Post, Story, User } from '../types'
import { ZoomablePhoto, StaticAvatar } from '../components/ZoomablePhoto'
import { Icon } from '../components/Icon'
import { LazyImage } from '../components/LazyImage'
import { Modal } from '../components/Modal'
import { useDispatch } from '../store/AppContext'
import { useToast } from '../components/Toast'
import { formatCount } from '../data/seed'
import { useMediaQuery } from '../hooks'

type Tab = 'posts' | 'reels' | 'tagged'

export interface ProfileProps {
  posts: Post[]
  byId: Map<string, User>
  users: User[]
  you: User
  stories: Story[]
  onShare: (postId: string) => void
}

function ProfileInner({ posts, users, you, onShare }: ProfileProps) {
  const { username } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useToast()

  const [tab, setTab] = useState<Tab>('posts')
  const [list, setList] = useState<'followers' | 'following' | null>(null)
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: you.name, bio: you.bio, website: you.website ?? '' })

  const user = useMemo(
    () => users.find((u) => u.username.toLowerCase() === (username ?? '').toLowerCase()) ?? you,
    [users, username, you],
  )
  const isMe = user.id === you.id

  const owned = useMemo(() => posts.filter((p) => p.userId === user.id), [posts, user.id])
  const reelPosts = useMemo(() => owned.filter((p) => p.media.length === 1).slice(0, 9), [owned])
  const tagged = useMemo(() => posts.filter((p) => p.userId !== user.id).slice(0, 6), [posts, user.id])

  const shown = tab === 'posts' ? owned : tab === 'reels' ? reelPosts : tagged
  const blocked = Boolean(user.isPrivate) && !isMe && !user.isFollowing

  const people = list === 'followers' ? users.filter((u) => u.id !== user.id).slice(0, 12) : users.filter((u) => u.id !== user.id).slice(4, 16)

  return (
    <div className="content content--wide" style={{ padding: 0 }}>
      <div className="profile">
        <div className="profile__head">
          {/* ★ hold (or tap) the profile photo → it zooms out of its circle, Instagram style */}
          <ZoomablePhoto
            src={user.avatar}
            alt={`${user.name}'s profile photo`}
            username={user.username}
            size={isDesktop ? 150 : 77}
            ring="unseen"
            holdMs={280}
          />

          <div className="profile__identity">
            <div className="profile__row">
              <h1 className="profile__username">
                {user.username}
                {user.verified ? <Icon name="verified" filled size={18} className="verified" /> : null}
              </h1>
              {isMe ? (
                <>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => setEditing(true)}>
                    Edit profile
                  </button>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => navigate('/settings')}>
                    <Icon name="gear" size={16} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className={`btn btn--sm ${user.isFollowing ? 'btn--ghost' : 'btn--primary'}`}
                    onClick={() => {
                      dispatch({ type: 'toggleFollow', userId: user.id })
                      toast(user.isFollowing ? `Unfollowed ${user.username}` : `Following ${user.username}`)
                    }}
                  >
                    {user.isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => navigate('/direct')}>
                    Message
                  </button>
                  <button type="button" className="icon-btn" onClick={() => onShare(user.username)} aria-label="More options">
                    <Icon name="more" size={20} />
                  </button>
                </>
              )}
            </div>

            <div className="profile__stats">
              <span>
                <span className="bold">{formatCount(user.postsCount)}</span> posts
              </span>
              <button type="button" onClick={() => setList('followers')}>
                <span className="bold">{formatCount(user.followers)}</span> followers
              </button>
              <button type="button" onClick={() => setList('following')}>
                <span className="bold">{formatCount(user.following)}</span> following
              </button>
            </div>

            <div className="profile__bio" style={{ display: 'block' }}>
              <div className="bold">{user.name}</div>
              {user.bio}
              {user.website ? (
                <a className="link-blue" href={`https://${user.website}`} target="_blank" rel="noreferrer">
                  {user.website}
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="profile__highlights no-scrollbar">
          {owned.slice(0, 5).map((p, i) => (
            <button type="button" className="highlight" key={p.id} onClick={() => navigate(`/p/${p.id}`)}>
              <span className="highlight__ring">
                <img src={p.media[0].src} alt="" loading="lazy" decoding="async" />
              </span>
              <span className="small truncate">Highlight {i + 1}</span>
            </button>
          ))}
          {owned.length === 0 ? (
            <div className="highlight">
              <span className="highlight__ring center muted">
                <Icon name="plus" size={24} />
              </span>
              <span className="small muted">New</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="profile__tabs" role="tablist">
        {(
          [
            ['posts', 'grid', 'Posts'],
            ['reels', 'reels', 'Reels'],
            ['tagged', 'tagged', 'Tagged'],
          ] as [Tab, 'grid' | 'reels' | 'tagged', string][]
        ).map(([key, icon, label]) => (
          <button
            type="button"
            key={key}
            role="tab"
            aria-selected={tab === key}
            className={`profile__tab ${tab === key ? 'is-on' : ''}`}
            onClick={() => setTab(key)}
          >
            <span className="row" style={{ gap: 6 }}>
              <Icon name={icon} size={12} />
              <span>{label.toUpperCase()}</span>
            </span>
          </button>
        ))}
      </div>

      {blocked ? (
        <div className="empty">
          <Icon name="archive" size={40} />
          <div>
            <div className="bold" style={{ color: 'var(--text)', marginBottom: 6 }}>
              This account is private
            </div>
            Follow @{user.username} to see their photos.
          </div>
        </div>
      ) : shown.length === 0 ? (
        <div className="empty">
          <Icon name="camera" size={40} />
          <div>
            <div className="bold" style={{ color: 'var(--text)', marginBottom: 6 }}>
              No posts yet
            </div>
            When {isMe ? 'you' : user.username} shares photos, they will show up here.
          </div>
        </div>
      ) : (
        <div className="profile-grid">
          {shown.map((post) => {
            const m = post.media[0]
            return (
              <button
                type="button"
                key={post.id}
                className="profile-grid__cell"
                onClick={() => navigate(`/p/${post.id}`)}
                aria-label="Open post"
              >
                <LazyImage src={m.src} alt={post.caption} ratio={1} lqip={m.lqip} color={m.color} />
                {post.media.length > 1 ? (
                  <span className="profile-grid__badge">
                    <Icon name="grid" size={16} />
                  </span>
                ) : null}
                <span className="explore-cell__hover">
                  <span className="row">
                    <Icon name="heart" filled size={18} /> {post.likes.toLocaleString('en-US')}
                  </span>
                  <span className="row">
                    <Icon name="comment" filled size={18} /> {post.comments.length}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      )}

      <Modal open={Boolean(list)} onClose={() => setList(null)} title={list === 'followers' ? 'Followers' : 'Following'}>
        <div className="modal__body" style={{ maxHeight: '60dvh' }}>
          {people.map((u) => (
            <div className="row" key={u.id} style={{ padding: '8px 4px' }}>
              <button type="button" onClick={() => { setList(null); navigate(`/${u.username}`) }} aria-label={`Open ${u.username}`}>
                <StaticAvatar src={u.avatar} alt={u.username} size={40} />
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="bold truncate">{u.username}</div>
                <div className="muted small truncate">{u.name}</div>
              </div>
              {u.id !== you.id ? (
                <button
                  type="button"
                  className={`btn btn--sm ${u.isFollowing ? 'btn--ghost' : 'btn--primary'}`}
                  onClick={() => dispatch({ type: 'toggleFollow', userId: u.id })}
                >
                  {u.isFollowing ? 'Following' : 'Follow'}
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </Modal>

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit profile">
        <div className="modal__body stack">
          <label className="stack" style={{ gap: 6 }}>
            <span className="upper">Name</span>
            <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="stack" style={{ gap: 6 }}>
            <span className="upper">Bio</span>
            <textarea
              className="field"
              style={{ height: 88, padding: 10, resize: 'vertical' }}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </label>
          <label className="stack" style={{ gap: 6 }}>
            <span className="upper">Website</span>
            <input className="field" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          </label>
          <button
            type="button"
            className="btn btn--primary btn--block"
            onClick={() => {
              dispatch({ type: 'setProfile', profile: form })
              setEditing(false)
              toast('Profile updated')
            }}
          >
            Save
          </button>
        </div>
      </Modal>

      <p className="tiny muted center" style={{ padding: '20px 16px 40px' }}>
        Tip: press and hold any profile photo — including yours above — to zoom it.
      </p>
    </div>
  )
}

const Profile = memo(ProfileInner)
export default Profile
