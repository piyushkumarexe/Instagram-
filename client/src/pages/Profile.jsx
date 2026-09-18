import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../store.jsx'
import { getUserByUsername, getUser, getUserPosts, getSaved, getLikedPosts, myFollowing, getHighlight, addStoryToHighlight, getStoryGroups, healUsername } from '../fb.js'
import Avatar from '../components/Avatar.jsx'
import PullToRefresh from '../components/PullToRefresh.jsx'
import RichText from '../components/RichText.jsx'
import FollowButton from '../components/FollowButton.jsx'
import { IcDots, IcGrid, IcReels, IcBookmark, IcPlay, IcCamera, IcSettings, IcLogout, IcHeart, IcVerified } from '../components/Icons.jsx'

export default function Profile() {
  const { username } = useParams()
  const app = useApp()
  const nav = useNavigate()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [reels, setReels] = useState([])
  const [saved, setSaved] = useState([])
  const [liked, setLiked] = useState([])
  const [tab, setTab] = useState('posts')
  const [error, setError] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [hasStory, setHasStory] = useState(false)
  const [highlight, setHighlight] = useState(null)

  const load = useCallback(async () => {
    try {
      let u = await getUserByUsername(username).catch(() => null)
      const myUsernames = [app.user.username, app.user._cachedUsername].filter(Boolean).map((x) => String(x).toLowerCase())
      if (!u && myUsernames.includes(username.toLowerCase())) {
        // apna profile, mapping broken? direct uid se load + auto-repair mapping
        u = await getUser(app.user.id).catch(() => null)
        if (u) healUsername(u)
      }
      if (!u) { setError('User not found'); return }
      const isMe = u.id === app.user.id
      u.isFollowing = myFollowing.has(u.id)
      u.isMe = isMe
      setProfile(u)
      const [ps, rl] = await Promise.all([
        getUserPosts(username, 'post'),
        getUserPosts(username, 'reel'),
      ])
      setPosts(ps)
      setReels(rl)
      setProfile((p) => ({ ...p, postsCount: ps.length }))
      if (isMe) {
        getSaved(app.user.id).then(setSaved).catch(() => {})
      }
      // story check
      import('../fb.js').then(({ getStoryGroups }) => {
        getStoryGroups(app.user.id).then((gs) => setHasStory(gs.some((g) => g.user.id === u.id))).catch(() => {})
      })
      getHighlight(u.id).then(setHighlight).catch(() => {})
    } catch (e) {
      setError(e.message)
    }
  }, [username])

  useEffect(() => { load() }, [load])
  useEffect(() => { setTab('posts') }, [username])

  useEffect(() => {
    if (tab === 'liked' && !liked.length) {
      getLikedPosts(app.user.id).then(setLiked).catch(() => {})
    }
  }, [tab])

  async function shareProfile() {
    setMenuOpen(false)
    try {
      const { Share } = await import('@capacitor/share')
      await Share.share({ title: profile.name || profile.username, url: `${location.origin}/${profile.username}`, dialogTitle: 'Share profile' })
    } catch {
      try { await navigator.clipboard.writeText(`${location.origin}/${profile.username}`); app.toast('Profile link copied 🔗') } catch {}
    }
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="pm-empty"><span className="big-emoji">😕</span><h3>{error}</h3></div>
      </div>
    )
  }
  if (!profile) return <div className="profile-page"><div className="modal-loading">Loading…</div></div>

  const me = profile.isMe
  const locked = !me && profile.isPrivate && !profile.isFollowing
  const shown = tab === 'posts' ? posts : tab === 'reels' ? reels : tab === 'saved' ? saved : liked

  async function logout() {
    await app.logout()
    nav('/accounts/login')
  }

  const refresh = load

  return (
    <div className="profile-page igp">
      {/* mobile header: username + menu */}
      <header className="igp-top">
        <h1>
          {profile.username}
          {profile.isPrivate && <span className="igp-lock" title="Private">🔒</span>}
        </h1>
        <div style={{ flex: 1 }} />
        {me ? (
          <button className="icon-btn" onClick={() => setMenuOpen(true)}><IcSettings size={23} /></button>
        ) : (
          <button className="icon-btn" onClick={() => setMenuOpen(true)}><IcDots size={22} /></button>
        )}
      </header>

      <PullToRefresh onRefresh={refresh}>
        {/* IG avatar + stats row */}
        <div className="igp-idrow">
          <div className="igp-avwrap">
            <Avatar user={profile} size={86} ring={hasStory} />
          </div>
          <div className="igp-stats">
            <div className="igp-stat"><strong>{posts.length}</strong><span>posts</span></div>
            <button className="igp-stat" onClick={() => nav('/' + profile.username + '/followers')}>
              <strong>{profile.followersCount}</strong><span>followers</span>
            </button>
            <button className="igp-stat" onClick={() => nav('/' + profile.username + '/following')}>
              <strong>{profile.followingCount}</strong><span>following</span>
            </button>
          </div>
        </div>

        <div className="igp-bio">
          <strong className="profile-name">
            {profile.name}{profile.verified && <IcVerified size={14} style={{ marginLeft: 5, verticalAlign: -2 }} />}
            {profile.pronouns && <span className="igp-pronouns">{profile.pronouns}</span>}
          </strong>
          {profile.bio && <RichText text={profile.bio} />}
          {profile.links && <RichText text={profile.links} />}
        </div>

        {/* action row */}
        <div className="igp-actions">
          {me ? (
            <>
              <button className="btn btn-grey igp-btn" onClick={() => nav('/accounts/edit')}>Edit profile</button>
              <button className="btn btn-grey igp-btn" onClick={shareProfile}>Share profile</button>
            </>
          ) : (
            <>
              <FollowButton user={profile} size="md" onChange={(u) => setProfile((p) => ({ ...p, ...u }))} />
              <button className="btn btn-grey igp-btn" onClick={() => nav('/messages/' + profile.username)}>Message</button>
            </>
          )}
        </div>

        {(highlight || (me && hasStory)) && (
          <div className="highlights-row">
            {highlight && highlight.media?.length > 0 && (
              <div className="highlight-cell" onClick={() => app.openStories(highlight.media.map((m) => ({ id: m, media: m, mediaType: 'image', createdAt: Date.now() })), 0)}>
                <div className="highlight-ring"><Avatar user={{ username: highlight.title, avatar: highlight.cover }} size={62} /></div>
                <span className="highlight-name">{highlight.title}</span>
              </div>
            )}
            {me && !highlight && (
              <div className="highlight-cell" onClick={async () => {
                try {
                  const gs = await getStoryGroups(app.user.id)
                  const mine = gs.find((g) => g.user.id === app.user.id)
                  if (!mine?.stories?.length) return app.toast('Add a story first to create a highlight ✨')
                  await addStoryToHighlight(app.user, mine.stories[mine.stories.length - 1])
                  setHighlight(await getHighlight(app.user.id))
                  app.toast('Highlight created ✨')
                } catch (e) { app.toast(e.message) }
              }}>
                <div className="highlight-ring highlight-new"><div className="avatar-inner" style={{ width: 62, height: 62, borderRadius: '50%' }}>＋</div></div>
                <span className="highlight-name">New</span>
              </div>
            )}
          </div>
        )}

        <div className="profile-tabs">
          <button className={tab === 'posts' ? 'on' : ''} onClick={() => setTab('posts')}><IcGrid size={12} /> POSTS</button>
          <button className={tab === 'reels' ? 'on' : ''} onClick={() => setTab('reels')}><IcReels size={12} /> REELS</button>
          {me && <button className={tab === 'saved' ? 'on' : ''} onClick={() => setTab('saved')}><IcBookmark size={12} /> SAVED</button>}
          {me && <button className={tab === 'liked' ? 'on' : ''} onClick={() => setTab('liked')}><IcHeart size={12} /> LIKED</button>}
        </div>

        {locked ? (
          <div className="profile-empty">
            <div className="profile-empty-ring">🔒</div>
            <h3>This account is private</h3>
            <p>Follow to see their photos and videos.</p>
          </div>
        ) : !shown.length ? (
          <div className="profile-empty">
            <div className="profile-empty-ring"><IcCamera size={44} sw={1.2} /></div>
            {tab === 'saved' ? (
              <><h3>Save</h3><p>Save photos and videos to see them here.</p></>
            ) : tab === 'liked' ? (
              <><h3>Liked posts</h3><p>Posts you like will show up here.</p></>
            ) : tab === 'reels' ? (
              <><h3>No reels yet</h3><p>Share your first reel with the + button.</p></>
            ) : me ? (
              <>
                <h3>Share photos</h3>
                <p>When you share photos, they will appear on your profile.</p>
                <button className="btn btn-blue" onClick={() => app.openCreate('post')}>Share your first photo</button>
              </>
            ) : (
              <><h3>No posts yet</h3><p>{profile.username} hasn't posted anything yet.</p></>
            )}
          </div>
        ) : (
          <div className="profile-grid">
            {shown.map((p) => (
              <button className="grid-cell" key={p.id} onClick={() => app.openPost(p.id)}>
                {p.mediaType === 'video' || p.type === 'reel' ? <span className="grid-play"><IcPlay size={22} /></span> : null}
                {p.mediaType === 'video' ? <video src={p.media} muted /> : <img src={p.media} alt={p.caption || 'post'} loading="lazy" decoding="async" />}
                <span className="grid-hover">
                  <span>❤️ {p.likes}</span>
                  <span>💬 {p.commentsCount}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </PullToRefresh>

      {menuOpen && (
        <div className="sheet-backdrop" onClick={() => setMenuOpen(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            {me ? (
              <>
                <button className="sheet-item" onClick={() => { setMenuOpen(false); nav('/accounts/edit') }}>✏️ Edit profile</button>
                <button className="sheet-item" onClick={shareProfile}>🔗 Share profile</button>
                <button className="sheet-item" onClick={() => { setMenuOpen(false); nav('/settings') }}><IcSettings size={18} /> Settings and privacy</button>
                <button className="sheet-item danger" onClick={logout}><IcLogout size={18} /> Log out</button>
              </>
            ) : (
              <>
                <button className="sheet-item" onClick={() => { setMenuOpen(false); nav('/messages/' + profile.username) }}>Send message</button>
                <button className="sheet-item" onClick={shareProfile}>🔗 Share profile</button>
                <button className="sheet-item" onClick={() => { setMenuOpen(false); app.toast('Report submitted 🚩') }}>Report</button>
              </>
            )}
            <button className="sheet-item" onClick={() => setMenuOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
