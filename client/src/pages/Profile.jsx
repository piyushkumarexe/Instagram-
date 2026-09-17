import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { api, formatCount } from '../api.js'
import { useApp } from '../store.jsx'
import Avatar from '../components/Avatar.jsx'
import FollowButton from '../components/FollowButton.jsx'
import UserListModal from '../components/UserListModal.jsx'
import { IcDots, IcGrid, IcReels, IcBookmark, IcPlay, IcCamera, IcSettings, IcLogout, IcPlusSquare, IcMenu } from '../components/Icons.jsx'

export default function Profile() {
  const { username } = useParams()
  const app = useApp()
  const nav = useNavigate()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [reels, setReels] = useState([])
  const [saved, setSaved] = useState([])
  const [tab, setTab] = useState('posts')
  const [error, setError] = useState('')
  const [listState, setListState] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hasStory, setHasStory] = useState(false)

  const load = useCallback(async () => {
    try {
      const [pr, ps, rl] = await Promise.all([
        api('/users/' + username),
        api(`/users/${username}/posts?type=post`),
        api(`/users/${username}/posts?type=reel`),
      ])
      setProfile(pr.user)
      setPosts(ps.posts)
      setReels(rl.posts)
      if (pr.user.isMe) {
        const sv = await api('/me/saved')
        setSaved(sv.posts)
      }
      try {
        const st = await api('/stories')
        setHasStory(st.groups.some((g) => g.user.username === username))
      } catch {}
    } catch (e) {
      setError(e.message)
    }
  }, [username])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const h = () => load()
    window.addEventListener('vg:refresh-profile', h)
    return () => window.removeEventListener('vg:refresh-profile', h)
  }, [load])

  useEffect(() => { setTab('posts') }, [username])

  if (error) {
    return (
      <div className="profile-page">
        <div className="pm-empty"><span className="big-emoji">😔</span><h3>Sorry, this page isn't available</h3><p>{error}</p></div>
      </div>
    )
  }
  if (!profile) return <div className="profile-page"><div className="modal-loading">Loading…</div></div>

  const me = profile.isMe
  const shown = tab === 'posts' ? posts : tab === 'reels' ? reels : saved

  async function logout() {
    app.logout()
    nav('/accounts/login')
  }

  return (
    <div className="profile-page">
      <header className="profile-head">
        <div className="profile-avatar" onClick={() => hasStory && app.toast('View ' + username + "'s story from the home feed ✨")}>
          <Avatar user={profile} size={150} ring={hasStory} />
        </div>
        <div className="profile-info">
          <div className="profile-row1">
            <h1>{profile.username}</h1>
            {me ? (
              <>
                <button className="btn btn-grey" onClick={() => nav('/accounts/edit')}>Edit profile</button>
                <button className="btn btn-grey" onClick={() => app.toast('Archive is a demo feature 🗄️')}>View archive</button>
                <button className="icon-btn" onClick={() => setMenuOpen(true)}><IcSettings size={24} /></button>
              </>
            ) : (
              <>
                <FollowButton user={profile} size="md" onChange={(u) => setProfile((p) => ({ ...p, ...u }))} />
                <button className="btn btn-grey" onClick={() => nav('/messages/' + profile.username)}>Message</button>
                <button className="icon-btn" onClick={() => setMenuOpen(true)}><IcDots size={22} /></button>
              </>
            )}
          </div>
          <div className="profile-counts">
            <span><strong>{formatCount(profile.postsCount)}</strong> posts</span>
            <button onClick={() => setListState({ title: 'Followers', username: profile.username, kind: 'followers' })}>
              <strong>{formatCount(profile.followersCount)}</strong> followers
            </button>
            <button onClick={() => setListState({ title: 'Following', username: profile.username, kind: 'following' })}>
              <strong>{formatCount(profile.followingCount)}</strong> following
            </button>
          </div>
          <div className="profile-bio">
            <strong className="profile-name">{profile.name}</strong>
            {profile.bio && <span>{profile.bio}</span>}
          </div>
        </div>
      </header>

      <div className="profile-tabs">
        <button className={tab === 'posts' ? 'on' : ''} onClick={() => setTab('posts')}><IcGrid size={12} /> POSTS</button>
        <button className={tab === 'reels' ? 'on' : ''} onClick={() => setTab('reels')}><IcReels size={12} /> REELS</button>
        {me && <button className={tab === 'saved' ? 'on' : ''} onClick={() => setTab('saved')}><IcBookmark size={12} /> SAVED</button>}
      </div>

      {!shown.length ? (
        <div className="profile-empty">
          <div className="profile-empty-ring"><IcCamera size={44} sw={1.2} /></div>
          {tab === 'saved' ? (
            <>
              <h3>Save</h3>
              <p>Save photos and videos to see them here.</p>
            </>
          ) : tab === 'reels' ? (
            <>
              <h3>No reels yet</h3>
              <p>Share your first reel with the + button.</p>
            </>
          ) : me ? (
            <>
              <h3>Share photos</h3>
              <p>When you share photos, they will appear on your profile.</p>
              <button className="btn btn-blue" onClick={() => app.openCreate('post')}>Share your first photo</button>
            </>
          ) : (
            <>
              <h3>No posts yet</h3>
              <p>{profile.username} hasn't posted anything yet.</p>
            </>
          )}
        </div>
      ) : (
        <div className="profile-grid">
          {shown.map((p) => (
            <button className="grid-cell" key={p.id} onClick={() => app.openPost(p.id)}>
              {p.mediaType === 'video' || p.type === 'reel' ? <span className="grid-play"><IcPlay size={22} /></span> : null}
              {p.savedByMe && tab === 'saved' && <span className="grid-saved"><IcBookmark size={16} /></span>}
              {p.mediaType === 'video' ? <video src={p.media} muted /> : <img src={p.media} alt={p.caption || 'post'} loading="lazy" />}
              <span className="grid-hover">
                <span>❤️ {formatCount(p.likes)}</span>
                <span>💬 {formatCount(p.commentsCount)}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {listState && <UserListModal userState={listState} onClose={() => setListState(null)} />}

      {menuOpen && (
        <div className="sheet-backdrop" onClick={() => setMenuOpen(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            {me ? (
              <>
                <button className="sheet-item" onClick={() => { setMenuOpen(false); nav('/accounts/edit') }}><IcSettings size={18} /> Settings and privacy</button>
                <button className="sheet-item danger" onClick={logout}><IcLogout size={18} /> Log out</button>
              </>
            ) : (
              <>
                <button className="sheet-item danger" onClick={() => setMenuOpen(false)}>Block</button>
                <button className="sheet-item" onClick={() => { setMenuOpen(false); app.toast('Reported (demo) 🚩') }}>Report</button>
              </>
            )}
            <button className="sheet-item" onClick={() => setMenuOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
